package com.example.StrangerMatching.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;

@Entity(name = "post_comment")
public class PostCommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "text",columnDefinition = "text",nullable = false)
    private String text;

    @Column(name = "created_date",nullable = false)
    private Date createdDate;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "post_id", referencedColumnName = "id",nullable = false)
    private PostEntity post;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "email",nullable = false)
    private UserEntity user;

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

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public PostEntity getPost() {
        return post;
    }

    public void setPost(PostEntity post) {
        this.post = post;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public PostCommentEntity() {
    }
}
