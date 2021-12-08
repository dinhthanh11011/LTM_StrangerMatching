package com.example.StrangerMatching.DTO;

import com.example.StrangerMatching.Entity.ReactionEntity;
import com.example.StrangerMatching.Entity.UserEntity;

public class PostReactionDTO {
    private Long id;
    private ReactionEntity reaction;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public ReactionEntity getReaction() {
        return reaction;
    }

    public void setReaction(ReactionEntity reaction) {
        this.reaction = reaction;
    }

    public PostReactionDTO(Long id,  ReactionEntity reaction) {
        this.id = id;
        this.reaction = reaction;
    }

    public PostReactionDTO() {
    }
}
