package com.example.StrangerMatching.Parser;

import com.example.StrangerMatching.DTO.ReactionDTO;
import com.example.StrangerMatching.Entity.ReactionEntity;

import java.util.ArrayList;
import java.util.List;

public class ReactionParser {
    public static ReactionDTO ToDTO(ReactionEntity reaction){
        return new ReactionDTO(reaction.getId(),reaction.getName());
    }

    public static List<ReactionDTO> ToListDTO(List<ReactionEntity> reactions){
        List<ReactionDTO> dtos = new ArrayList<>();
        for (ReactionEntity reaction:reactions) {
            dtos.add(ToDTO(reaction));
        }
        return dtos;
    }
}
