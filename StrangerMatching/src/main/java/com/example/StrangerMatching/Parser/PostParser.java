package com.example.StrangerMatching.Parser;

import com.example.StrangerMatching.DTO.PostDTO;
import com.example.StrangerMatching.Entity.PostEntity;

import java.util.ArrayList;
import java.util.List;

public class PostParser {
    public static PostDTO ToDTO(PostEntity post) {
        return new PostDTO(post.getId(), post.getCaption(), post.getCreatedDate(), post.getUser(), post.getImages(), post.getReactions());
    }

    public static List<PostDTO> ToListDTO(List<PostEntity> posts) {
        List<PostDTO> dtos = new ArrayList<>();
        for (PostEntity post : posts) {
            dtos.add(ToDTO(post));
        }
        return dtos;
    }
}
