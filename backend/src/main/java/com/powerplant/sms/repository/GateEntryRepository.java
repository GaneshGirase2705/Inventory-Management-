package com.powerplant.sms.repository;

import com.powerplant.sms.model.GateEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GateEntryRepository extends JpaRepository<GateEntry, UUID> {
    Optional<GateEntry> findByGatePassNumber(String gatePassNumber);
    Optional<GateEntry> findByChallanNumber(String challanNumber);
}
