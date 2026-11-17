package com.powerplant.sms.repository;

import com.powerplant.sms.model.ConsumptionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsumptionHistoryRepository extends JpaRepository<ConsumptionHistory, Long> {
    List<ConsumptionHistory> findByComponentNameOrderByConsumptionDateAsc(String componentName);
}
