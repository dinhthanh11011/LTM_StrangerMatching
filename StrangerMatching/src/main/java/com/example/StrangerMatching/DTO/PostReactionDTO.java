package com.example.StrangerMatching.DTO;

import com.example.StrangerMatching.Entity.ReactionEntity;
import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Parser.ReactionParser;
import com.example.StrangerMatching.Parser.UserParser;

public class PostReactionDTO {
    private Long id;
    private ReactionDTO reaction;
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

    public ReactionDTO getReaction() {
        return reaction;
    }

    public void setReaction(ReactionDTO reaction) {
        this.reaction = reaction;
    }

    public PostReactionDTO(Long id, ReactionEntity reaction, UserEntity user) {
        this.id = id;
        this.reaction = ReactionParser.ToDTO(reaction);
        this.user = UserParser.ToDTO(user);
    }

    public PostReactionDTO() {
    }
}
