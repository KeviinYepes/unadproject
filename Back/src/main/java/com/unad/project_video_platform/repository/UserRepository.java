package com.unad.project_video_platform.repository;

import com.unad.project_video_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByDocumentNumber(String documentNumber);
    
    boolean existsByEmail(String email);
    
    boolean existsByDocumentNumber(String documentNumber);
    
    List<User> findByRoleId(Integer roleId);
}
