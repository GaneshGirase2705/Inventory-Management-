package com.powerplant.sms.repository;

import com.powerplant.sms.model.GoodsReceiptNote;
import com.powerplant.sms.model.enums.QaClearanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GoodsReceiptNoteRepository extends JpaRepository<GoodsReceiptNote, UUID> {
    Optional<GoodsReceiptNote> findByGrnNumber(String grnNumber);
    List<GoodsReceiptNote> findByQaStatus(QaClearanceStatus qaStatus);
}
