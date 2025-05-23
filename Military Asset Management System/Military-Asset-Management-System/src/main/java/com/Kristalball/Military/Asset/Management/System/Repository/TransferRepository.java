package com.Kristalball.Military.Asset.Management.System.Repository;

import com.Kristalball.Military.Asset.Management.System.Entities.TransferEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TransferRepository extends JpaRepository<TransferEntity, Long>, JpaSpecificationExecutor<TransferEntity> {
    @Query("SELECT COALESCE(SUM(t.quantity), 0) FROM TransferEntity t " +
            "WHERE (:baseId IS NULL OR t.toBaseId = :baseId) " +
            "AND (:assertId IS NULL OR t.assertId = :assertId)")
    int sumQuantityByToBaseId(@Param("baseId") Long baseId, @Param("assertId") Long assertId);

    @Query("SELECT COALESCE(SUM(t.quantity), 0) FROM TransferEntity t " +
            "WHERE (:baseId IS NULL OR t.fromBaseId = :baseId) " +
            "AND (:assertId IS NULL OR t.assertId = :assertId)")
    int sumQuantityByFromBaseId(@Param("baseId") Long baseId, @Param("assertId") Long assertId);

    @Query("SELECT COALESCE(SUM(t.quantity), 0) FROM TransferEntity t " +
            "JOIN AssertEntity a ON t.assertId = a.id " +
            "WHERE (:baseId IS NULL OR t.toBaseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND t.transferDate < :startDate")
    int sumQuantityByToBaseIdBefore(@Param("baseId") Long baseId,
                                    @Param("equipmentType") String equipmentType,
                                    @Param("startDate") LocalDate startDate);

    @Query("SELECT COALESCE(SUM(t.quantity), 0) FROM TransferEntity t " +
            "JOIN AssertEntity a ON t.assertId = a.id " +
            "WHERE (:baseId IS NULL OR t.fromBaseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND t.transferDate < :startDate")
    int sumQuantityByFromBaseIdBefore(@Param("baseId") Long baseId,
                                      @Param("equipmentType") String equipmentType,
                                      @Param("startDate") LocalDate startDate);

    @Query("SELECT COALESCE(SUM(t.quantity), 0) FROM TransferEntity t " +
            "JOIN AssertEntity a ON t.assertId = a.id " +
            "WHERE (:baseId IS NULL OR t.toBaseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND t.transferDate >= :startDate AND t.transferDate <= :endDate")
    int sumQuantityByToBaseId(@Param("baseId") Long baseId,
                              @Param("equipmentType") String equipmentType,
                              @Param("startDate") LocalDate startDate,
                              @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.quantity), 0) FROM TransferEntity t " +
            "JOIN AssertEntity a ON t.assertId = a.id " +
            "WHERE (:baseId IS NULL OR t.fromBaseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND t.transferDate >= :startDate AND t.transferDate <= :endDate")
    int sumQuantityByFromBaseId(@Param("baseId") Long baseId,
                                @Param("equipmentType") String equipmentType,
                                @Param("startDate") LocalDate startDate,
                                @Param("endDate") LocalDate endDate);

    @Query("SELECT t FROM TransferEntity t " +
            "JOIN AssertEntity a ON t.assertId = a.id " +
            "WHERE (:baseId IS NULL OR t.toBaseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND t.transferDate >= :startDate AND t.transferDate <= :endDate")
    List<TransferEntity> findByToBaseId(@Param("baseId") Long baseId,
                                        @Param("equipmentType") String equipmentType,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    @Query("SELECT t FROM TransferEntity t " +
            "JOIN AssertEntity a ON t.assertId = a.id " +
            "WHERE (:baseId IS NULL OR t.fromBaseId = :baseId) " +
            "AND (:equipmentType IS NULL OR a.type = :equipmentType) " +
            "AND t.transferDate >= :startDate AND t.transferDate <= :endDate")
    List<TransferEntity> findByFromBaseId(@Param("baseId") Long baseId,
                                          @Param("equipmentType") String equipmentType,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);
}