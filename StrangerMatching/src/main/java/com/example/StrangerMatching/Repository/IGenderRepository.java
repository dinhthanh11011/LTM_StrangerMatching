package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.GenderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IGenderRepository extends JpaRepository<GenderEntity, Long> {
}
