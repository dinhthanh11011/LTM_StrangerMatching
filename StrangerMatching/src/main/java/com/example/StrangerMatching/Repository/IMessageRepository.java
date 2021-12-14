package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IMessageRepository extends JpaRepository<MessageEntity, Long> {
}
