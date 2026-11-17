package com.powerplant.sms.controller;

import com.powerplant.sms.dto.ScanTransactionRequest;
import com.powerplant.sms.model.Item;
import com.powerplant.sms.model.ItemStock;
import com.powerplant.sms.model.StockLedger;
import com.powerplant.sms.model.enums.AbcClass;
import com.powerplant.sms.model.enums.StockTransactionType;
import com.powerplant.sms.repository.ItemRepository;
import com.powerplant.sms.repository.ItemStockRepository;
import com.powerplant.sms.repository.StockLedgerRepository;
import com.powerplant.sms.service.StockTransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final ItemRepository itemRepository;
    private final ItemStockRepository itemStockRepository;
    private final StockLedgerRepository stockLedgerRepository;
    private final StockTransactionService stockTransactionService;

    public InventoryController(ItemRepository itemRepository,
                               ItemStockRepository itemStockRepository,
                               StockLedgerRepository stockLedgerRepository,
                               StockTransactionService stockTransactionService) {
        this.itemRepository = itemRepository;
        this.itemStockRepository = itemStockRepository;
        this.stockLedgerRepository = stockLedgerRepository;
        this.stockTransactionService = stockTransactionService;
    }

    @GetMapping("/items")
    public ResponseEntity<List<Map<String, Object>>> getItems(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String abc) {
        List<Item> items;
        if (search != null && !search.trim().isEmpty()) {
            items = itemRepository.searchItems(search.trim());
        } else if (abc != null && !abc.equals("all") && !abc.trim().isEmpty()) {
            try {
                items = itemRepository.findByAbcClassification(AbcClass.valueOf(abc.toUpperCase()));
            } catch (Exception e) {
                items = itemRepository.findAll();
            }
        } else {
            items = itemRepository.findAll();
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (Item item : items) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", item.getId());
            map.put("itemCode", item.getItemCode());
            map.put("partNumber", item.getPartNumber());
            map.put("name", item.getName());
            map.put("description", item.getDescription());
            map.put("category", item.getCategory());
            map.put("department", item.getDepartment() != null ? item.getDepartment().name() : null);
            map.put("uom", item.getUom());
            map.put("abcClassification", item.getAbcClassification() != null ? item.getAbcClassification().name() : "C");
            map.put("vedClassification", item.getVedClassification() != null ? item.getVedClassification().name() : "D");
            map.put("minStockLevel", item.getMinStockLevel());
            map.put("maxStockLevel", item.getMaxStockLevel());
            map.put("reorderPoint", item.getReorderPoint());
            map.put("isRotable", item.getIsRotable());
            map.put("requiresQaClearance", item.getRequiresQaClearance());
            map.put("shelfLifeDays", item.getShelfLifeDays());
            map.put("qrCodeUrl", "/api/v1/qr/" + item.getItemCode());

            Integer totalStock = itemStockRepository.getTotalStockByItemId(item.getId());
            map.put("currentStock", totalStock != null ? totalStock : 0);

            // Fetch primary bin location if any
            List<ItemStock> stockList = itemStockRepository.findByItemId(item.getId());
            if (!stockList.isEmpty() && stockList.get(0).getLocation() != null) {
                map.put("locationCode", stockList.get(0).getLocation().getLocationCode());
                map.put("unitCost", stockList.get(0).getUnitCost());
                map.put("nextCalibrationDue", stockList.get(0).getNextCalibrationDue());
                map.put("expiryDate", stockList.get(0).getExpiryDate());
            } else {
                map.put("locationCode", "UNASSIGNED");
                map.put("unitCost", 0);
            }

            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable UUID id) {
        return itemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/items")
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        Item saved = itemRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable UUID id, @RequestBody Item updated) {
        return itemRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setDescription(updated.getDescription());
            existing.setPartNumber(updated.getPartNumber());
            existing.setCategory(updated.getCategory());
            existing.setMinStockLevel(updated.getMinStockLevel());
            existing.setMaxStockLevel(updated.getMaxStockLevel());
            existing.setReorderPoint(updated.getReorderPoint());
            existing.setAbcClassification(updated.getAbcClassification());
            existing.setVedClassification(updated.getVedClassification());
            existing.setIsRotable(updated.getIsRotable());
            return ResponseEntity.ok(itemRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stock")
    public ResponseEntity<List<ItemStock>> getAllStock() {
        return ResponseEntity.ok(itemStockRepository.findAll());
    }

    @PostMapping("/stock/scan-issue")
    public ResponseEntity<Map<String, Object>> scanIssue(@RequestBody ScanTransactionRequest request) {
        StockTransactionType type = request.isEmergencyOverride() ?
                StockTransactionType.EMERGENCY_ISSUE : StockTransactionType.NORMAL_ISSUE;

        StockLedger ledger = stockTransactionService.executeStockTransaction(
                request.getItemId(),
                request.getLocationId(),
                request.getQuantity(),
                type,
                request.getReferenceDocNumber(),
                request.getRemarks()
        );

        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("transactionUuid", ledger.getTransactionUuid());
        res.put("balanceAfter", ledger.getBalanceAfter());
        res.put("timestamp", ledger.getTransactionTimestamp());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/stock/scan-inward")
    public ResponseEntity<Map<String, Object>> scanInward(@RequestBody ScanTransactionRequest request) {
        StockLedger ledger = stockTransactionService.executeStockTransaction(
                request.getItemId(),
                request.getLocationId(),
                request.getQuantity(),
                StockTransactionType.INWARD_GRN,
                request.getReferenceDocNumber(),
                request.getRemarks()
        );

        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("transactionUuid", ledger.getTransactionUuid());
        res.put("balanceAfter", ledger.getBalanceAfter());
        res.put("timestamp", ledger.getTransactionTimestamp());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/stock/ledger/{itemId}")
    public ResponseEntity<List<StockLedger>> getItemLedger(@PathVariable UUID itemId) {
        return ResponseEntity.ok(stockLedgerRepository.findByItemIdOrderByTimestampDesc(itemId));
    }
}
