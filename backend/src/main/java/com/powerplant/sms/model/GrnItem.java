package com.powerplant.sms.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "grn_items")
@Getter @Setter
public class GrnItem {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grn_id", nullable = false)
    private GoodsReceiptNote goodsReceiptNote;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "challan_qty", nullable = false)
    private Integer challanQty;

    @Column(name = "received_qty", nullable = false)
    private Integer receivedQty;

    @Column(name = "accepted_qty", nullable = false)
    private Integer acceptedQty = 0;

    @Column(name = "rejected_qty", nullable = false)
    private Integer rejectedQty = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private WarehouseLocation location;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
