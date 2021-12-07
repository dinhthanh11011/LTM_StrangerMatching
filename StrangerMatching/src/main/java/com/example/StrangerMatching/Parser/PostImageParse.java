package com.example.StrangerMatching.Parser;

import com.example.StrangerMatching.DTO.PostImageDTO;
import com.example.StrangerMatching.Entity.PostImageEntity;

import java.util.ArrayList;
import java.util.List;

public class PostImageParse {
    public static PostImageDTO ToDTO(PostImageEntity postImage){
        return new PostImageDTO(postImage.getId(),postImage.getName());
    }

    public static List<PostImageDTO> ToListDTO(List<PostImageEntity> postImages){
        List<PostImageDTO> dtos = new ArrayList<>();
        for (PostImageEntity postImage:postImages) {
            dtos.add(ToDTO(postImage));
        }
        return dtos;
    }
}
