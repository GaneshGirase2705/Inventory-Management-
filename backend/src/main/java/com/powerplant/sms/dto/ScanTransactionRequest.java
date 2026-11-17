package com.powerplant.sms.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter @Setter
public class ScanTransactionRequest {
    private UUID itemId;
    private UUID locationId;
    private int quantity;
    private String transactionType; // NORMAL_ISSUE, EMERGENCY_ISSUE, INWARD_GRN, RETURN_TO_STORE
    private String referenceDocNumber; // e.g. Indent Number or GRN
    private String remarks;
    private boolean emergencyOverride;
}
