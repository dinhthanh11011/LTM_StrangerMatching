package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IMessageRepository extends JpaRepository<MessageEntity, Long> {
    public List<MessageEntity> findBySendFrom_EmailAndSendTo_EmailOrSendFrom_EmailAndSendTo_EmailOrderByCreatedDateAsc(String sendFromOne,String sendToOne,String sendFromTwo,String sendToTwo);
}

