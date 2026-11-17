package com.powerplant.sms.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "warehouse_locations")
@Getter @Setter
public class WarehouseLocation {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, length = 10)
    private String zone;

    @Column(nullable = false, length = 10)
    private String bay;

    @Column(nullable = false, length = 10)
    private String rack;

    @Column(nullable = false, length = 10)
    private String bin;

    @Column(name = "location_code", unique = true, nullable = false, length = 50)
    private String locationCode; // e.g. Z1-B04-R02-B12

    private String description;

    @Column(name = "capacity_level")
    private Integer capacityLevel = 100;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
