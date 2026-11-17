package com.powerplant.sms.model;

import com.powerplant.sms.model.enums.AbcClass;
import com.powerplant.sms.model.enums.Department;
import com.powerplant.sms.model.enums.VedClass;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "items")
@Getter @Setter
public class Item {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "item_code", unique = true, nullable = false, length = 50)
    private String itemCode;

    @Column(name = "part_number", length = 100)
    private String partNumber;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Department department;

    @Column(nullable = false, length = 20)
    private String uom = "EA";

    @Enumerated(EnumType.STRING)
    @Column(name = "abc_classification", nullable = false, length = 5)
    private AbcClass abcClassification;

    @Enumerated(EnumType.STRING)
    @Column(name = "ved_classification", nullable = false, length = 5)
    private VedClass vedClassification;

    @Column(name = "min_stock_level", nullable = false)
    private Integer minStockLevel = 0;

    @Column(name = "max_stock_level", nullable = false)
    private Integer maxStockLevel = 100;

    @Column(name = "reorder_point", nullable = false)
    private Integer reorderPoint = 10;

    @Column(name = "safety_stock", nullable = false)
    private Integer safetyStock = 5;

    @Column(name = "is_rotable")
    private Boolean isRotable = false;

    @Column(name = "requires_qa_clearance")
    private Boolean requiresQaClearance = true;

    @Column(name = "shelf_life_days")
    private Integer shelfLifeDays;

    @Column(name = "qr_code_url", columnDefinition = "TEXT")
    private String qrCodeUrl;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Version
    private Integer version = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
