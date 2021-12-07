package com.example.StrangerMatching.Repository;

import com.example.StrangerMatching.Entity.PostImageEntity;
import com.example.StrangerMatching.Entity.ReactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IReactionRepository extends JpaRepository<ReactionEntity,Long> {
}
