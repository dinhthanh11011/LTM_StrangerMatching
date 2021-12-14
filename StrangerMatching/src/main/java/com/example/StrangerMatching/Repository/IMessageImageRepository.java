package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.MessageImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IMessageImageRepository extends JpaRepository<MessageImageEntity, Long> {
}
