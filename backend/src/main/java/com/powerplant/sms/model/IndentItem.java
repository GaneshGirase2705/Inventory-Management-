package com.powerplant.sms.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "indent_items")
@Getter @Setter
public class IndentItem {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "indent_id", nullable = false)
    private Indent indent;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "requested_qty", nullable = false)
    private Integer requestedQty;

    @Column(name = "issued_qty", nullable = false)
    private Integer issuedQty = 0;

    private String remarks;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
