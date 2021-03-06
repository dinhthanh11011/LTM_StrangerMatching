package com.example.StrangerMatching.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity(name = "post")
public class PostEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "caption",columnDefinition = "text")
    private String caption;

    @Column(name = "created_date",nullable = false)
    private Date createdDate;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "email",nullable = false)
    private UserEntity user;

    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE)
    @JsonManagedReference
    @JsonIgnore
    private List<PostImageEntity> images;

    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE)
    @JsonManagedReference
    @JsonIgnore
    private List<PostCommentEntity> comments;

    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE)
    @JsonManagedReference
    @JsonIgnore
    private List<PostReactionEntity> reactions;

    public List<PostReactionEntity> getReactions() {
        return reactions;
    }

    public void setReactions(List<PostReactionEntity> reactions) {
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

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public List<PostImageEntity> getImages() {
        return images;
    }

    public void setImages(List<PostImageEntity> images) {
        this.images = images;
    }

    public List<PostCommentEntity> getComments() {
        return comments;
    }

    public void setComments(List<PostCommentEntity> comments) {
        this.comments = comments;
    }

    public PostEntity() {
    }
}
