package com.Kristalball.Military.Asset.Management.System.Repository;

import com.Kristalball.Military.Asset.Management.System.Entities.UserEntity;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByUsername(String username);
}
