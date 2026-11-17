package com.powerplant.sms.repository;

import com.powerplant.sms.model.Item;
import com.powerplant.sms.model.ItemStock;
import com.powerplant.sms.model.WarehouseLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ItemStockRepository extends JpaRepository<ItemStock, UUID> {
    Optional<ItemStock> findByItemAndLocation(Item item, WarehouseLocation location);

    List<ItemStock> findByItem(Item item);

    @Query("SELECT s FROM ItemStock s WHERE s.item.id = :itemId")
    List<ItemStock> findByItemId(@Param("itemId") UUID itemId);

    @Query("SELECT s FROM ItemStock s WHERE s.item.id = :itemId AND s.location.id = :locationId")
    Optional<ItemStock> findByItemIdAndLocationId(@Param("itemId") UUID itemId, @Param("locationId") UUID locationId);

    @Query("SELECT SUM(s.currentStock) FROM ItemStock s WHERE s.item.id = :itemId")
    Integer getTotalStockByItemId(@Param("itemId") UUID itemId);
}
