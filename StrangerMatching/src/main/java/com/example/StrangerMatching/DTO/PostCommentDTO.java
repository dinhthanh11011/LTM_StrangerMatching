package com.example.StrangerMatching.DTO;

import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Parser.UserParser;

import java.util.Date;

public class PostCommentDTO {
    private Long id;
    private String text;
    private Date createdDate;
    private UserDTO user;

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public PostCommentDTO(Long id, String text, Date createdDate, UserEntity user) {
        this.id = id;
        this.text = text;
        this.createdDate = createdDate;
        this.user = UserParser.ToDTO(user);
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public PostCommentDTO() {
    }
}
