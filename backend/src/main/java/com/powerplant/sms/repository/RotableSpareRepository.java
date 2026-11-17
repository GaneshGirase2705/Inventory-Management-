package com.powerplant.sms.repository;

import com.powerplant.sms.model.RotableSpare;
import com.powerplant.sms.model.enums.RotableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RotableSpareRepository extends JpaRepository<RotableSpare, UUID> {
    Optional<RotableSpare> findBySerialNumber(String serialNumber);
    List<RotableSpare> findByCurrentStatus(RotableStatus currentStatus);
}
