package com.powerplant.sms.model;

import com.powerplant.sms.model.enums.QaClearanceStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "goods_receipt_notes")
@Getter @Setter
public class GoodsReceiptNote {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "grn_number", unique = true, nullable = false, length = 50)
    private String grnNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gate_entry_id")
    private GateEntry gateEntry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id")
    private PurchaseOrder purchaseOrder;

    @Enumerated(EnumType.STRING)
    @Column(name = "qa_status", nullable = false, length = 30)
    private QaClearanceStatus qaStatus = QaClearanceStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "qa_engineer_id")
    private User qaEngineer;

    @Column(name = "qa_inspection_date")
    private OffsetDateTime qaInspectionDate;

    @Column(name = "qa_remarks", columnDefinition = "TEXT")
    private String qaRemarks;

    @Column(name = "test_certificate_url", columnDefinition = "TEXT")
    private String testCertificateUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by")
    private User receivedBy;

    @OneToMany(mappedBy = "goodsReceiptNote", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GrnItem> items = new ArrayList<>();

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
