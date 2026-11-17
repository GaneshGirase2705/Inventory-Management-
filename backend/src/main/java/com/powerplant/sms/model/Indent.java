package com.powerplant.sms.model;

import com.powerplant.sms.model.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "indents")
@Getter @Setter
public class Indent {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "indent_number", unique = true, nullable = false, length = 50)
    private String indentNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(name = "plant_unit", nullable = false, length = 30)
    private PlantUnit plantUnit;

    @Column(name = "work_order_number", length = 50)
    private String workOrderNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "indent_type", nullable = false, length = 30)
    private IndentType indentType = IndentType.REGULAR;

    @Column(length = 20)
    private String priority = "NORMAL";

    // Emergency Breakdown Override Workflow Fields
    @Column(name = "is_emergency_override", nullable = false)
    private Boolean isEmergencyOverride = false;

    @Column(name = "emergency_justification", columnDefinition = "TEXT")
    private String emergencyJustification;

    @Column(name = "post_facto_approved", nullable = false)
    private Boolean postFactoApproved = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_facto_approved_by")
    private User postFactoApprovedBy;

    @Column(name = "post_facto_approval_time")
    private OffsetDateTime postFactoApprovalTime;

    @Column(name = "post_facto_deadline")
    private OffsetDateTime postFactoDeadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private IndentStatus status = IndentStatus.DRAFT;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_approver_role", length = 30)
    private UserRole currentApproverRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private User approver;

    @Column(name = "approver_remarks", columnDefinition = "TEXT")
    private String approverRemarks;

    @OneToMany(mappedBy = "indent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IndentItem> items = new ArrayList<>();

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
