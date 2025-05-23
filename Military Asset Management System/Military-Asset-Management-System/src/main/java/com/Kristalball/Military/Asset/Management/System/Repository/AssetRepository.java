package com.Kristalball.Military.Asset.Management.System.Repository;

import com.Kristalball.Military.Asset.Management.System.Entities.AssertEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<AssertEntity, Long>{
    Optional<AssertEntity> findById(Long id);
}
