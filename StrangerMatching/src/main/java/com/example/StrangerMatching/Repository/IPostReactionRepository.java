package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.PostReactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPostReactionRepository extends JpaRepository<PostReactionEntity, Long> {
    public PostReactionEntity findByPost_IdAndUser_Email(Long postId, String userEmail);

}
