package com.powerplant.sms.repository;

import com.powerplant.sms.model.ScrapLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScrapLedgerRepository extends JpaRepository<ScrapLedger, UUID> {
    Optional<ScrapLedger> findByScrapLotNumber(String scrapLotNumber);
}
