package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.PostCommentEntity;
import com.example.StrangerMatching.Entity.PostImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPostCommentRepository extends JpaRepository<PostCommentEntity, Long> {
    public List<PostCommentEntity> deleteAllByPost_Id(Long postId);
}
