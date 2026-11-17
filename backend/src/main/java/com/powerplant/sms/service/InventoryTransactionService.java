package com.powerplant.sms.service;

import com.powerplant.sms.model.enums.StockTransactionType;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class InventoryTransactionService {

    private final StockTransactionService stockTransactionService;

    public InventoryTransactionService(StockTransactionService stockTransactionService) {
        this.stockTransactionService = stockTransactionService;
    }

    public void recordTransaction(UUID itemId, int quantityChange, StockTransactionType type, String remarks) {
        stockTransactionService.executeStockTransaction(
                itemId,
                null,
                Math.abs(quantityChange),
                type,
                "TX-" + System.currentTimeMillis(),
                remarks
        );
    }
}
