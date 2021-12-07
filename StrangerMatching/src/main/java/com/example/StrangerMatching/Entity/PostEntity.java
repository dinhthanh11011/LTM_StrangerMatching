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

    @Column(name = "total_like")
    private int totalLike;

    @Column(name = "created_date")
    private Date createdDate;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "email")
    private UserEntity user;

    @OneToMany(mappedBy = "post")
    @JsonManagedReference
    @JsonIgnore
    private List<PostImageEntity> images;

    @OneToMany(mappedBy = "post")
    @JsonManagedReference
    @JsonIgnore
    private List<PostCommentEntity> comments;

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
