package com.powerplant.sms.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "vendors")
@Getter @Setter
public class Vendor {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "vendor_code", unique = true, nullable = false, length = 50)
    private String vendorCode;

    @Column(name = "vendor_name", nullable = false)
    private String vendorName;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(length = 100)
    private String email;

    @Column(length = 25)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "gst_number", length = 20)
    private String gstNumber;

    @Column(name = "vendor_rating", precision = 3, scale = 2)
    private BigDecimal vendorRating = BigDecimal.valueOf(4.00);

    @Column(name = "is_approved")
    private Boolean isApproved = true;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
