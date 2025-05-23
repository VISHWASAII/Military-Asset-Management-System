package com.Kristalball.Military.Asset.Management.System.Repository;

import com.Kristalball.Military.Asset.Management.System.Entities.AssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<AssignmentEntity, Long> {
    @Query("SELECT COALESCE(SUM(a.quantity), 0) FROM AssignmentEntity a " +
            "WHERE (:baseId IS NULL OR a.baseId = :baseId) " +
            "AND (:assertId IS NULL OR a.assertId = :assertId)")
    int sumQuantityByBaseIdAndAssertId(@Param("baseId") Long baseId, @Param("assertId") Long assertId);

    @Query("SELECT COALESCE(SUM(a.quantity), 0) FROM AssignmentEntity a " +
            "JOIN AssertEntity ae ON a.assertId = ae.id " +
            "WHERE (:baseId IS NULL OR a.baseId = :baseId) " +
            "AND (:equipmentType IS NULL OR ae.type = :equipmentType) " +
            "AND a.assignmentDate < :startDate")
    int sumQuantityByBaseIdAndAssetTypeBefore(@Param("baseId") Long baseId,
                                              @Param("equipmentType") String equipmentType,
                                              @Param("startDate") LocalDate startDate);

    @Query("SELECT COALESCE(SUM(a.quantity), 0) FROM AssignmentEntity a " +
            "JOIN AssertEntity ae ON a.assertId = ae.id " +
            "WHERE (:baseId IS NULL OR a.baseId = :baseId) " +
            "AND (:equipmentType IS NULL OR ae.type = :equipmentType) " +
            "AND a.assignmentDate >= :startDate AND a.assignmentDate <= :endDate")
    int sumQuantityByBaseIdAndAssetType(@Param("baseId") Long baseId,
                                        @Param("equipmentType") String equipmentType,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    // Add find method if needed
    @Query("SELECT a FROM AssignmentEntity a " +
            "JOIN AssertEntity ae ON a.assertId = ae.id " +
            "WHERE (:baseId IS NULL OR a.baseId = :baseId) " +
            "AND (:equipmentType IS NULL OR ae.type = :equipmentType) " +
            "AND a.assignmentDate >= :startDate AND a.assignmentDate <= :endDate")
    List<AssignmentEntity> findByBaseIdAndAssetType(@Param("baseId") Long baseId,
                                                    @Param("equipmentType") String equipmentType,
                                                    @Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate);

}
