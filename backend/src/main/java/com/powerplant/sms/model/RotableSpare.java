package com.powerplant.sms.model;

import com.powerplant.sms.model.enums.PlantUnit;
import com.powerplant.sms.model.enums.RotableStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "rotable_spares")
@Getter @Setter
public class RotableSpare {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "serial_number", unique = true, nullable = false, length = 100)
    private String serialNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false, length = 30)
    private RotableStatus currentStatus = RotableStatus.IN_STORE_READY;

    @Enumerated(EnumType.STRING)
    @Column(name = "plant_unit", nullable = false, length = 30)
    private PlantUnit plantUnit;

    @Column(name = "current_equipment_tag", length = 100)
    private String currentEquipmentTag; // e.g., BFP-1A, MSV-2-ACTUATOR

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private WarehouseLocation location;

    @Column(name = "last_overhaul_date")
    private LocalDate lastOverhaulDate;

    @Column(name = "next_overhaul_due")
    private LocalDate nextOverhaulDue;

    @Column(name = "accumulated_running_hours")
    private Integer accumulatedRunningHours = 0;

    @Column(name = "overhaul_count")
    private Integer overhaulCount = 0;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
