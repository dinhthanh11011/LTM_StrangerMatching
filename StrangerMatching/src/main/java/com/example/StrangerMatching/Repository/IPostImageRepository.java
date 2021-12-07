package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.PostImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPostImageRepository extends JpaRepository<PostImageEntity, Long> {
    public List<PostImageEntity> deleteAllByPost_Id(Long postId);
}
