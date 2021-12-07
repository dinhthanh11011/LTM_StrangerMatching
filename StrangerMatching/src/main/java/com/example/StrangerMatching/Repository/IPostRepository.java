package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPostRepository extends JpaRepository<PostEntity, Long> {
    public List<PostEntity> findAllByOrderByCreatedDateDesc();
}
