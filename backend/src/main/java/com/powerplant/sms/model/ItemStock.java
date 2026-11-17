package com.powerplant.sms.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "item_stock", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"item_id", "location_id"})
})
@Getter @Setter
public class ItemStock {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id", nullable = false)
    private WarehouseLocation location;

    @Column(name = "current_stock", nullable = false)
    private Integer currentStock = 0;

    @Column(name = "reserved_stock", nullable = false)
    private Integer reservedStock = 0;

    @Column(name = "unit_cost", precision = 18, scale = 2, nullable = false)
    private BigDecimal unitCost = BigDecimal.ZERO;

    @Column(name = "batch_lot_number", length = 50)
    private String batchLotNumber;

    @Column(name = "next_calibration_due")
    private OffsetDateTime nextCalibrationDue;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Version
    private Integer version = 0;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
