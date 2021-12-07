package com.example.StrangerMatching.Api;

import com.example.StrangerMatching.DTO.PostDTO;
import com.example.StrangerMatching.Parser.PostParser;
import com.example.StrangerMatching.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/Post")
public class PostApi {
    @Autowired
    private PostService postService;

    @GetMapping()
    public List<PostDTO> getAll(){
        return PostParser.ToListDTO(postService.getAll());
    }
}
