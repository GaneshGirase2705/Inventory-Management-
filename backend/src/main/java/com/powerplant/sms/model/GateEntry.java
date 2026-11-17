package com.powerplant.sms.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "gate_entries")
@Getter @Setter
public class GateEntry {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "gate_pass_number", unique = true, nullable = false, length = 50)
    private String gatePassNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id")
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @Column(name = "vehicle_number", nullable = false, length = 50)
    private String vehicleNumber;

    @Column(name = "driver_name", length = 100)
    private String driverName;

    @Column(name = "driver_phone", length = 25)
    private String driverPhone;

    @Column(name = "challan_number", nullable = false, length = 100)
    private String challanNumber;

    @Column(name = "challan_date", nullable = false)
    private LocalDate challanDate;

    @Column(name = "challan_gcs_url", columnDefinition = "TEXT")
    private String challanGcsUrl;

    @Column(name = "entry_timestamp")
    private OffsetDateTime entryTimestamp = OffsetDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "security_officer_id")
    private User securityOfficer;

    @Column(length = 30)
    private String status = "ENTERED_GATE";

    @Column(columnDefinition = "TEXT")
    private String remarks;
}
