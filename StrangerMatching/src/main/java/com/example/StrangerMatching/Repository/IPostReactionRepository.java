package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.PostReactionEntity;
import com.example.StrangerMatching.Entity.ReactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPostReactionRepository extends JpaRepository<PostReactionEntity, Long> {
    public List<PostReactionEntity> deleteAllByPost_Id(Long postId);
    public PostReactionEntity findByIdAndUser_Email(Long postId, String userEmail);

}
