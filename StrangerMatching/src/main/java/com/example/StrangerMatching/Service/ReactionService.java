package com.example.StrangerMatching.Service;

import com.example.StrangerMatching.Entity.ReactionEntity;
import com.example.StrangerMatching.Repository.IReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReactionService {
    @Autowired
    private IReactionRepository iReactionRepository;

    public List<ReactionEntity> getAll(){
        return iReactionRepository.findAll();
    }
}
