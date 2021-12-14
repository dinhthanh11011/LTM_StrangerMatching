package com.example.StrangerMatching.Parser;

import com.example.StrangerMatching.DTO.MessageImageDTO;
import com.example.StrangerMatching.Entity.MessageImageEntity;

import java.util.ArrayList;
import java.util.List;

public class MessageImageParser {
    public static MessageImageDTO ToDTO(MessageImageEntity MessImage) {
        return new MessageImageDTO(MessImage.getId(), MessImage.getName());
    }

    public static List<MessageImageDTO> ToListDTO(List<MessageImageEntity> MessImages) {
        List<MessageImageDTO> dtos = new ArrayList<>();
        for (MessageImageEntity MessImage : MessImages) {
            dtos.add(ToDTO(MessImage));
        }
        return dtos;
    }
}
