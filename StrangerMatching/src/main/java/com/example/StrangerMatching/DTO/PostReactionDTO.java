package com.example.StrangerMatching.DTO;

import com.example.StrangerMatching.Entity.ReactionEntity;
import com.example.StrangerMatching.Entity.UserEntity;

public class PostReactionDTO {
    private Long id;
    private UserEntity user;
    private ReactionEntity reaction;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public PostReactionDTO(Long id, UserEntity user, ReactionEntity reaction) {
        this.id = id;
        this.user = user;
        this.reaction = reaction;
    }

    public PostReactionDTO() {
    }
}
