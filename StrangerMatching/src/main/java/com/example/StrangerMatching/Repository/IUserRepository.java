package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUserRepository extends JpaRepository<UserEntity, String> {
    public UserEntity findByEmail(String email);
    public boolean existsByEmail(String email);
}
