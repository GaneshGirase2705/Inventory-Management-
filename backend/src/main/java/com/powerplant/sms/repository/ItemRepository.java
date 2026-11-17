package com.powerplant.sms.repository;

import com.powerplant.sms.model.Item;
import com.powerplant.sms.model.enums.AbcClass;
import com.powerplant.sms.model.enums.Department;
import com.powerplant.sms.model.enums.VedClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ItemRepository extends JpaRepository<Item, UUID> {
    Optional<Item> findByItemCode(String itemCode);

    List<Item> findByDepartment(Department department);

    List<Item> findByAbcClassification(AbcClass abcClassification);

    List<Item> findByVedClassification(VedClass vedClassification);

    @Query("SELECT i FROM Item i WHERE " +
           "LOWER(i.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(i.itemCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(i.partNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(i.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Item> searchItems(@Param("query") String query);
}
