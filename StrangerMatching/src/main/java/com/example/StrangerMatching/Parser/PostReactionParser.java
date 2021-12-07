package com.example.StrangerMatching.Parser;

import com.example.StrangerMatching.DTO.PostImageDTO;
import com.example.StrangerMatching.DTO.PostReactionDTO;
import com.example.StrangerMatching.Entity.PostImageEntity;
import com.example.StrangerMatching.Entity.PostReactionEntity;

import java.util.ArrayList;
import java.util.List;

public class PostReactionParser {
    public static PostReactionDTO ToDTO(PostReactionEntity postReaction){
        return new PostReactionDTO(postReaction.getId(),postReaction.getUser(),postReaction.getReaction());
    }

    public static List<PostReactionDTO> ToListDTO(List<PostReactionEntity> postReactions){
        List<PostReactionDTO> dtos = new ArrayList<>();
        for (PostReactionEntity postReaction:postReactions) {
            dtos.add(ToDTO(postReaction));
        }
        return dtos;
    }
}
