package com.powerplant.sms.service;

import com.powerplant.sms.model.Item;
import com.powerplant.sms.model.ItemStock;
import com.powerplant.sms.model.StockLedger;
import com.powerplant.sms.model.User;
import com.powerplant.sms.model.WarehouseLocation;
import com.powerplant.sms.model.enums.StockTransactionType;
import com.powerplant.sms.repository.ItemRepository;
import com.powerplant.sms.repository.ItemStockRepository;
import com.powerplant.sms.repository.StockLedgerRepository;
import com.powerplant.sms.repository.WarehouseLocationRepository;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class StockTransactionService {

    private final ItemRepository itemRepository;
    private final ItemStockRepository itemStockRepository;
    private final StockLedgerRepository stockLedgerRepository;
    private final WarehouseLocationRepository locationRepository;
    private final AuthService authService;

    public StockTransactionService(ItemRepository itemRepository,
                                   ItemStockRepository itemStockRepository,
                                   StockLedgerRepository stockLedgerRepository,
                                   WarehouseLocationRepository locationRepository,
                                   AuthService authService) {
        this.itemRepository = itemRepository;
        this.itemStockRepository = itemStockRepository;
        this.stockLedgerRepository = stockLedgerRepository;
        this.locationRepository = locationRepository;
        this.authService = authService;
    }

    /**
     * Executes QR scan-based stock deduction or inward receipt with JPA @Version optimistic locking.
     * Guarantees atomic ledger logging and prevents concurrent race conditions on physical store bins.
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public StockLedger executeStockTransaction(UUID itemId,
                                               UUID locationId,
                                               int quantity,
                                               StockTransactionType type,
                                               String referenceDocNumber,
                                               String remarks) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Transaction quantity must be greater than zero");
        }

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found with ID: " + itemId));

        WarehouseLocation finalLocation = null;
        if (locationId != null) {
            finalLocation = locationRepository.findById(locationId).orElse(null);
        }

        // Find or create item_stock entry for this item & location
        ItemStock stock;
        if (finalLocation != null) {
            WarehouseLocation targetLocation = finalLocation;
            stock = itemStockRepository.findByItemAndLocation(item, targetLocation)
                    .orElseGet(() -> {
                        ItemStock newStock = new ItemStock();
                        newStock.setItem(item);
                        newStock.setLocation(targetLocation);
                        newStock.setCurrentStock(0);
                        newStock.setReservedStock(0);
                        return newStock;
                    });
        } else {
            // Pick first existing bin if location unspecified
            stock = itemStockRepository.findByItem(item).stream().findFirst()
                    .orElseThrow(() -> new IllegalStateException("No warehouse location mapped for item: " + item.getItemCode()));
            finalLocation = stock.getLocation();
        }

        int currentBalance = stock.getCurrentStock();
        int newBalance;
        int qtyIn = 0;
        int qtyOut = 0;

        switch (type) {
            case INWARD_GRN:
            case RETURN_TO_STORE:
            case ROTABLE_CHECKIN:
                qtyIn = quantity;
                newBalance = currentBalance + quantity;
                break;

            case NORMAL_ISSUE:
            case EMERGENCY_ISSUE:
            case ROTABLE_CHECKOUT:
            case SCRAP_ADJUSTMENT:
                if (currentBalance < quantity) {
                    throw new IllegalStateException("Insufficient stock in bin " + (finalLocation != null ? finalLocation.getLocationCode() : "N/A") +
                            ". Available: " + currentBalance + ", Requested: " + quantity);
                }
                qtyOut = quantity;
                newBalance = currentBalance - quantity;
                break;

            case INVENTORY_AUDIT:
                newBalance = quantity;
                if (newBalance > currentBalance) {
                    qtyIn = newBalance - currentBalance;
                } else {
                    qtyOut = currentBalance - newBalance;
                }
                break;

            default:
                throw new IllegalArgumentException("Unsupported stock transaction type: " + type);
        }

        // Update Stock (triggers @Version check on commit)
        stock.setCurrentStock(newBalance);
        stock.setUpdatedAt(OffsetDateTime.now());
        try {
            itemStockRepository.save(stock);
        } catch (OptimisticLockingFailureException ex) {
            throw new OptimisticLockingFailureException("Concurrent bin update conflict on part " +
                    item.getItemCode() + " in bin " + (finalLocation != null ? finalLocation.getLocationCode() : "N/A") + ". Please re-scan.", ex);
        }

        // Record to Append-Only Immutable Stock Ledger
        User currentUser = authService.getCurrentUser();
        StockLedger ledger = new StockLedger();
        ledger.setTransactionUuid(UUID.randomUUID());
        ledger.setTransactionTimestamp(OffsetDateTime.now());
        ledger.setTransactionType(type);
        ledger.setItem(item);
        ledger.setLocation(finalLocation);
        ledger.setReferenceDocNumber(referenceDocNumber != null ? referenceDocNumber : "SCAN-" + System.currentTimeMillis());
        ledger.setQtyIn(qtyIn);
        ledger.setQtyOut(qtyOut);
        ledger.setBalanceAfter(newBalance);
        ledger.setPerformedBy(currentUser);
        ledger.setRemarks(remarks);

        return stockLedgerRepository.save(ledger);
    }
}
