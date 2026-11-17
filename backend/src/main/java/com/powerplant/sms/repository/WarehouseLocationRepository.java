package com.powerplant.sms.repository;

import com.powerplant.sms.model.WarehouseLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WarehouseLocationRepository extends JpaRepository<WarehouseLocation, UUID> {
    Optional<WarehouseLocation> findByLocationCode(String locationCode);
}
