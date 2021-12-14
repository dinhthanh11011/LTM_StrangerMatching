package com.example.StrangerMatching.Service;

import com.example.StrangerMatching.Common.FileUploadSupport;
import com.example.StrangerMatching.Entity.MessageEntity;
import com.example.StrangerMatching.Entity.MessageImageEntity;
import com.example.StrangerMatching.Repository.IMessageImageRepository;
import com.example.StrangerMatching.Repository.IMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class MessageService {
    @Autowired
    private IMessageRepository iMessageRepository;

    @Autowired
    private IMessageImageRepository iMessageImageRepository;

    public MessageEntity createOne(MessageEntity message) {
        return iMessageRepository.save(message);
    }

    public boolean deleteOne(Long messageId) {
        try {
            for (MessageImageEntity mesImg:iMessageImageRepository.findAll()) {
                FileUploadSupport.deleteOneByName(mesImg.getName());
            }
            iMessageRepository.deleteById(messageId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
