package com.powerplant.sms.controller;

import com.powerplant.sms.model.Item;
import com.powerplant.sms.model.ItemStock;
import com.powerplant.sms.repository.ItemRepository;
import com.powerplant.sms.repository.ItemStockRepository;
import com.powerplant.sms.service.QrCodeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/qr")
@CrossOrigin(origins = "*")
public class QrController {

    private final ItemRepository itemRepository;
    private final ItemStockRepository itemStockRepository;
    private final QrCodeService qrCodeService;

    public QrController(ItemRepository itemRepository,
                        ItemStockRepository itemStockRepository,
                        QrCodeService qrCodeService) {
        this.itemRepository = itemRepository;
        this.itemStockRepository = itemStockRepository;
        this.qrCodeService = qrCodeService;
    }

    /**
     * Generates a dynamic QR code label containing the Part Code, Name, Bin coordinate, and deep link.
     */
    @GetMapping(value = "/{itemCode}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrCodeLabel(@PathVariable String itemCode) {
        try {
            Item item = itemRepository.findByItemCode(itemCode).orElse(null);
            String binLocation = "UNASSIGNED";
            if (item != null) {
                List<ItemStock> stockList = itemStockRepository.findByItemId(item.getId());
                if (!stockList.isEmpty() && stockList.get(0).getLocation() != null) {
                    binLocation = stockList.get(0).getLocation().getLocationCode();
                }
            }

            // QR payload formatted for industrial mobile barcode scanners & PWA camera
            String qrPayload = String.format("SMS-PART|CODE:%s|LOC:%s|NAME:%s",
                    itemCode,
                    binLocation,
                    item != null ? item.getName() : "Item");

            byte[] qrImageBytes = qrCodeService.generateQrCodePng(qrPayload, 300, 300);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + itemCode + "-QR.png\"")
                    .contentType(MediaType.IMAGE_PNG)
                    .body(qrImageBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
