package com.powerplant.sms.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "consumption_history")
@Getter @Setter
public class ConsumptionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "component_name", nullable = false, length = 100)
    private String componentName;

    @Column(name = "plant_unit", nullable = false, length = 50)
    private String plantUnit;

    @Column(name = "consumption_date", nullable = false)
    private LocalDate consumptionDate;

    @Column(name = "daily_usage", precision = 12, scale = 4, nullable = false)
    private BigDecimal dailyUsage;

    @Column(name = "running_hours", precision = 6, scale = 2, nullable = false)
    private BigDecimal runningHours;

    @Column(name = "failure_event")
    private Boolean failureEvent = false;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
