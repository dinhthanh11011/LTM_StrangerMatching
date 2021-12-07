package com.example.StrangerMatching.Api;

import com.example.StrangerMatching.DTO.ReactionDTO;
import com.example.StrangerMatching.Parser.ReactionParser;
import com.example.StrangerMatching.Service.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/Reaction")
public class ReactionApi {
    @Autowired
    private ReactionService reactionService;

    @GetMapping()
    public List<ReactionDTO> getAll(){
        return ReactionParser.ToListDTO(reactionService.getAll());
    }
}
