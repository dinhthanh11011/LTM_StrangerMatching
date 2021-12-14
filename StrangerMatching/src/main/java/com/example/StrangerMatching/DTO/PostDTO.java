package com.example.StrangerMatching.DTO;

import com.example.StrangerMatching.Entity.PostImageEntity;
import com.example.StrangerMatching.Entity.PostReactionEntity;
import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Parser.PostImageParse;
import com.example.StrangerMatching.Parser.PostReactionParser;
import com.example.StrangerMatching.Parser.UserParser;

import java.util.Date;
import java.util.List;

public class PostDTO {
    private Long id;
    private String caption;
    private Date createdDate;
    private UserDTO user;
    private List<PostImageDTO> images;
    private List<PostReactionDTO> reactions;
    private int totalReaction;

    public int getTotalReaction() {
        return totalReaction;
    }

    public void setTotalReaction(int totalReaction) {
        this.totalReaction = totalReaction;
    }

    public List<PostReactionDTO> getReactions() {
        return reactions;
    }

    public void setReactions(List<PostReactionDTO> reactions) {
        this.reactions = reactions;
    }

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

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public List<PostImageDTO> getImages() {
        return images;
    }

    public void setImages(List<PostImageDTO> images) {
        this.images = images;
    }

    public PostDTO(Long id, String caption, Date createdDate, UserEntity user, List<PostImageEntity> images, List<PostReactionEntity> reactions) {
        this.id = id;
        this.caption = caption;
        this.createdDate = createdDate;
        this.user = UserParser.ToDTO(user);
        this.images = PostImageParse.ToListDTO(images);
        this.reactions = PostReactionParser.ToListDTO(reactions);
        this.totalReaction = this.reactions.size();
    }

    public PostDTO() {
    }
}
