package com.Kristalball.Military.Asset.Management.System.Repository;

import com.Kristalball.Military.Asset.Management.System.Entities.ExpenditureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenditureRepository extends JpaRepository<ExpenditureEntity, Long> {
    @Query("SELECT COALESCE(SUM(e.quantity), 0) FROM ExpenditureEntity e " +
            "WHERE (:baseId IS NULL OR e.baseId = :baseId) " +
            "AND (:assertId IS NULL OR e.assertId = :assertId)")
    int sumQuantityByBaseIdAndAssertId(@Param("baseId") Long baseId, @Param("assertId") Long assertId);

    @Query("SELECT COALESCE(SUM(e.quantity), 0) FROM ExpenditureEntity e " +
            "JOIN AssertEntity a ON e.assertId = a.id " +
            "WHERE (:baseId IS NULL OR e.baseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND e.expenditureDate < :startDate")
    int sumQuantityByBaseIdAndAssetTypeBefore(@Param("baseId") Long baseId,
                                              @Param("equipmentType") String equipmentType,
                                              @Param("startDate") LocalDate startDate);

    @Query("SELECT COALESCE(SUM(e.quantity), 0) FROM ExpenditureEntity e " +
            "JOIN AssertEntity a ON e.assertId = a.id " +
            "WHERE (:baseId IS NULL OR e.baseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND e.expenditureDate >= :startDate AND e.expenditureDate <= :endDate")
    int sumQuantityByBaseIdAndAssetType(@Param("baseId") Long baseId,
                                        @Param("equipmentType") String equipmentType,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    @Query("SELECT e FROM ExpenditureEntity e " +
            "JOIN AssertEntity a ON e.assertId = a.id " +
            "WHERE (:baseId IS NULL OR e.baseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND e.expenditureDate >= :startDate AND e.expenditureDate <= :endDate")
    List<ExpenditureEntity> findByBaseIdAndAssetType(@Param("baseId") Long baseId,
                                                     @Param("equipmentType") String equipmentType,
                                                     @Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);
}
