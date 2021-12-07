package com.example.StrangerMatching.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity(name = "post_reaction")
public class PostReactionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "post_id",referencedColumnName = "id")
    private PostEntity post;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "user_id",referencedColumnName = "email")
    private UserEntity user;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "reaction_id",referencedColumnName = "id")
    private ReactionEntity reaction;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public ReactionEntity getReaction() {
        return reaction;
    }

    public void setReaction(ReactionEntity reaction) {
        this.reaction = reaction;
    }
}
