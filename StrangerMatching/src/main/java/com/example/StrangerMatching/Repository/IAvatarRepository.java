package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.AvatarEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAvatarRepository extends JpaRepository<AvatarEntity, Long> {
}
