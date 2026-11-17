package com.powerplant.sms.model;

import com.powerplant.sms.model.enums.ScrapStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "scrap_ledger")
@Getter @Setter
public class ScrapLedger {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "scrap_lot_number", unique = true, nullable = false, length = 50)
    private String scrapLotNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rotable_id")
    private RotableSpare rotable;

    @Column(name = "condemned_date", nullable = false)
    private LocalDate condemnedDate;

    @Column(name = "condemnation_reason", nullable = false, columnDefinition = "TEXT")
    private String condemnationReason;

    @Column(name = "estimated_salvage_value", precision = 18, scale = 2)
    private BigDecimal estimatedSalvageValue = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "scrap_status", nullable = false, length = 30)
    private ScrapStatus scrapStatus = ScrapStatus.CONDEMNED_PENDING_AUCTION;

    @Column(name = "auction_batch_id", length = 50)
    private String auctionBatchId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_hod_id", nullable = false)
    private User approvedByHod;

    @Column(name = "scrap_certificate_url", columnDefinition = "TEXT")
    private String scrapCertificateUrl;

    @Column(name = "disposal_date")
    private LocalDate disposalDate;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
