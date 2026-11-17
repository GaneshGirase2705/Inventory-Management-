package com.powerplant.sms.dto;

import com.powerplant.sms.model.enums.Department;
import com.powerplant.sms.model.enums.IndentType;
import com.powerplant.sms.model.enums.PlantUnit;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter @Setter
public class IndentRequest {
    private Department department;
    private PlantUnit plantUnit;
    private String workOrderNumber;
    private IndentType indentType;
    private String priority;
    private boolean isEmergencyOverride;
    private String emergencyJustification;
    private List<IndentItemDto> items;

    @Getter @Setter
    public static class IndentItemDto {
        private UUID itemId;
        private int requestedQty;
        private String remarks;
    }
}
