package com.powerplant.sms.controller;

import com.powerplant.sms.model.Item;
import com.powerplant.sms.model.ItemStock;
import com.powerplant.sms.model.enums.AbcClass;
import com.powerplant.sms.model.enums.IndentStatus;
import com.powerplant.sms.model.enums.VedClass;
import com.powerplant.sms.repository.IndentRepository;
import com.powerplant.sms.repository.ItemRepository;
import com.powerplant.sms.repository.ItemStockRepository;
import com.powerplant.sms.repository.StockLedgerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/v1/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final ItemRepository itemRepository;
    private final ItemStockRepository itemStockRepository;
    private final IndentRepository indentRepository;
    private final StockLedgerRepository stockLedgerRepository;

    public AnalyticsController(ItemRepository itemRepository,
                               ItemStockRepository itemStockRepository,
                               IndentRepository indentRepository,
                               StockLedgerRepository stockLedgerRepository) {
        this.itemRepository = itemRepository;
        this.itemStockRepository = itemStockRepository;
        this.indentRepository = indentRepository;
        this.stockLedgerRepository = stockLedgerRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<Item> allItems = itemRepository.findAll();
        List<ItemStock> allStocks = itemStockRepository.findAll();

        int lowStockCount = 0;
        BigDecimal totalInventoryValue = BigDecimal.ZERO;

        for (Item item : allItems) {
            Integer totalStock = itemStockRepository.getTotalStockByItemId(item.getId());
            int currentStock = totalStock != null ? totalStock : 0;
            if (currentStock <= item.getMinStockLevel()) {
                lowStockCount++;
            }
        }

        for (ItemStock stock : allStocks) {
            if (stock.getCurrentStock() != null && stock.getUnitCost() != null) {
                totalInventoryValue = totalInventoryValue.add(
                        stock.getUnitCost().multiply(BigDecimal.valueOf(stock.getCurrentStock()))
                );
            }
        }

        int pendingIndents = indentRepository.findByStatus(IndentStatus.SUBMITTED).size() +
                indentRepository.findByStatus(IndentStatus.QA_PENDING).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalItems", allItems.size());
        stats.put("lowStockAlerts", lowStockCount);
        stats.put("pendingIndents", pendingIndents);
        stats.put("totalInventoryValue", totalInventoryValue);
        stats.put("totalTransactions", stockLedgerRepository.count());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/abc")
    public ResponseEntity<Map<String, Object>> getAbcAnalysis() {
        List<Item> allItems = itemRepository.findAll();
        long aCount = allItems.stream().filter(i -> i.getAbcClassification() == AbcClass.A).count();
        long bCount = allItems.stream().filter(i -> i.getAbcClassification() == AbcClass.B).count();
        long cCount = allItems.stream().filter(i -> i.getAbcClassification() == AbcClass.C).count();

        Map<String, Object> result = new HashMap<>();
        result.put("classA", aCount);
        result.put("classB", bCount);
        result.put("classC", cCount);
        result.put("total", allItems.size());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/ved")
    public ResponseEntity<Map<String, Object>> getVedAnalysis() {
        List<Item> allItems = itemRepository.findAll();
        long vCount = allItems.stream().filter(i -> i.getVedClassification() == VedClass.V).count();
        long eCount = allItems.stream().filter(i -> i.getVedClassification() == VedClass.E).count();
        long dCount = allItems.stream().filter(i -> i.getVedClassification() == VedClass.D).count();

        Map<String, Object> result = new HashMap<>();
        result.put("vital", vCount);
        result.put("essential", eCount);
        result.put("desirable", dCount);
        result.put("total", allItems.size());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/rop-alerts")
    public ResponseEntity<List<Map<String, Object>>> getRopAlerts() {
        List<Item> allItems = itemRepository.findAll();
        List<Map<String, Object>> alerts = new ArrayList<>();

        for (Item item : allItems) {
            Integer totalStock = itemStockRepository.getTotalStockByItemId(item.getId());
            int current = totalStock != null ? totalStock : 0;
            if (current <= item.getReorderPoint()) {
                Map<String, Object> alert = new HashMap<>();
                alert.put("itemId", item.getId());
                alert.put("itemCode", item.getItemCode());
                alert.put("name", item.getName());
                alert.put("currentStock", current);
                alert.put("reorderPoint", item.getReorderPoint());
                alert.put("safetyStock", item.getSafetyStock());
                alert.put("ved", item.getVedClassification() != null ? item.getVedClassification().name() : "D");
                alerts.add(alert);
            }
        }
        return ResponseEntity.ok(alerts);
    }
}
