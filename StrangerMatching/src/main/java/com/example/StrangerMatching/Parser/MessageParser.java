package com.example.StrangerMatching.Parser;

import com.example.StrangerMatching.DTO.MessageDTO;
import com.example.StrangerMatching.Entity.MessageEntity;

import java.util.ArrayList;
import java.util.List;

public class MessageParser {
    public static MessageDTO ToDTO(MessageEntity mess) {
        return new MessageDTO(mess.getId(),mess.getText(),mess.getCreatedDate(),mess.getSendFrom(),mess.getSendTo(),mess.getImages());
    }

    public static List<MessageDTO> ToListDTO(List<MessageEntity> messages) {
        List<MessageDTO> dtos = new ArrayList<>();
        for (MessageEntity mess : messages) {
            dtos.add(ToDTO(mess));
        }
        return dtos;
    }
}
