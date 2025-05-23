package com.Kristalball.Military.Asset.Management.System.Repository;

import com.Kristalball.Military.Asset.Management.System.Entities.PurchaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<PurchaseEntity, Long> {
    @Query("SELECT COALESCE(SUM(p.quantity), 0) FROM PurchaseEntity p " +
            "WHERE (:baseId IS NULL OR p.baseId = :baseId) " +
            "AND (:assertId IS NULL OR p.assertId = :assertId)")
    int sumQuantityByBaseIdAndAssertId(@Param("baseId") Long baseId, @Param("assertId") Long assertId);

    @Query("SELECT COALESCE(SUM(p.quantity), 0) FROM PurchaseEntity p " +
            "JOIN AssertEntity a ON p.assertId = a.id " +
            "WHERE (:baseId IS NULL OR p.baseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND p.purchaseDate < :startDate")
    int sumQuantityByBaseIdAndAssetTypeBefore(@Param("baseId") Long baseId,
                                              @Param("equipmentType") String equipmentType,
                                              @Param("startDate") LocalDate startDate);

    @Query("SELECT COALESCE(SUM(p.quantity), 0) FROM PurchaseEntity p " +
            "JOIN AssertEntity a ON p.assertId = a.id " +
            "WHERE (:baseId IS NULL OR p.baseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND p.purchaseDate >= :startDate AND p.purchaseDate <= :endDate")
    int sumQuantityByBaseIdAndAssetType(@Param("baseId") Long baseId,
                                        @Param("equipmentType") String equipmentType,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    @Query("SELECT p FROM PurchaseEntity p " +
            "JOIN AssertEntity a ON p.assertId = a.id " +
            "WHERE (:baseId IS NULL OR p.baseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND p.purchaseDate >= :startDate AND p.purchaseDate <= :endDate")
    List<PurchaseEntity> findByBaseIdAndAssetType(@Param("baseId") Long baseId,
                                                  @Param("equipmentType") String equipmentType,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);
}
