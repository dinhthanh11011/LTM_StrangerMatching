package com.example.StrangerMatching.Parser;

import com.example.StrangerMatching.DTO.PostCommentDTO;
import com.example.StrangerMatching.Entity.PostCommentEntity;

import java.util.ArrayList;
import java.util.List;

public class PostCommentParser {
    public static PostCommentDTO ToDTO(PostCommentEntity postComment){
        return new PostCommentDTO(postComment.getId(),postComment.getText(),postComment.getCreatedDate(),postComment.getUser());
    }

    public static List<PostCommentDTO> ToListDTO(List<PostCommentEntity> postComments){
        List<PostCommentDTO> dtos = new ArrayList<>();
        for (PostCommentEntity postComment:postComments) {
            dtos.add(ToDTO(postComment));
        }
        return dtos;
    }
}
