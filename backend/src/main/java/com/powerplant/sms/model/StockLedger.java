package com.powerplant.sms.model;

import com.powerplant.sms.model.enums.StockTransactionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "stock_ledger")
@Getter @Setter
public class StockLedger {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "transaction_uuid", unique = true, nullable = false)
    private UUID transactionUuid;

    @Column(name = "transaction_timestamp", nullable = false)
    private OffsetDateTime transactionTimestamp = OffsetDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 30)
    private StockTransactionType transactionType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id")
    private WarehouseLocation location;

    @Column(name = "reference_doc_number", nullable = false, length = 50)
    private String referenceDocNumber;

    @Column(name = "qty_in", nullable = false)
    private Integer qtyIn = 0;

    @Column(name = "qty_out", nullable = false)
    private Integer qtyOut = 0;

    @Column(name = "balance_after", nullable = false)
    private Integer balanceAfter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by", nullable = false)
    private User performedBy;

    @Column(columnDefinition = "TEXT")
    private String remarks;
}
