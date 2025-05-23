package com.Kristalball.Military.Asset.Management.System.Repository;

import com.Kristalball.Military.Asset.Management.System.Entities.BaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BaseRepository extends JpaRepository<BaseEntity, Long> {

    Optional<BaseEntity> findById(Long id);

}
