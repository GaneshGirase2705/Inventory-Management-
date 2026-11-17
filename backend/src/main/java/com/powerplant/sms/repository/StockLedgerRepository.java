package com.powerplant.sms.repository;

import com.powerplant.sms.model.StockLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockLedgerRepository extends JpaRepository<StockLedger, UUID> {
    @Query("SELECT l FROM StockLedger l WHERE l.item.id = :itemId ORDER BY l.transactionTimestamp DESC")
    List<StockLedger> findByItemIdOrderByTimestampDesc(@Param("itemId") UUID itemId);

    List<StockLedger> findTop50ByOrderByTransactionTimestampDesc();
}
