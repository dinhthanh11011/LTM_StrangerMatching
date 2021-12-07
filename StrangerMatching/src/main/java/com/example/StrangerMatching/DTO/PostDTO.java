package com.example.StrangerMatching.DTO;

import com.example.StrangerMatching.Entity.PostCommentEntity;
import com.example.StrangerMatching.Entity.PostImageEntity;
import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Parser.PostCommentParser;
import com.example.StrangerMatching.Parser.PostImageParse;

import java.util.Date;
import java.util.List;

public class PostDTO {
    private Long id;
    private String caption;
    private int totalLike;
    private Date createdDate;
    private UserEntity user;
    private List<PostImageDTO> images;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public int getTotalLike() {
        return totalLike;
    }

    public void setTotalLike(int totalLike) {
        this.totalLike = totalLike;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public List<PostImageDTO> getImages() {
        return images;
    }

    public void setImages(List<PostImageDTO> images) {
        this.images = images;
    }

    public PostDTO(Long id, String caption, int totalLike, Date createdDate, UserEntity user, List<PostImageEntity> images) {
        this.id = id;
        this.caption = caption;
        this.totalLike = totalLike;
        this.createdDate = createdDate;
        this.user = user;
        this.images = PostImageParse.ToListDTO(images);
    }

    public PostDTO() {
    }
}
