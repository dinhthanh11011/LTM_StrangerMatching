package com.example.StrangerMatching.Api;

import com.example.StrangerMatching.Common.BaseResponsibilityMessage;
import com.example.StrangerMatching.DTO.PostDTO;
import com.example.StrangerMatching.Entity.PostEntity;
import com.example.StrangerMatching.Entity.PostReactionEntity;
import com.example.StrangerMatching.Parser.PostParser;
import com.example.StrangerMatching.Repository.IPostReactionRepository;
import com.example.StrangerMatching.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/Post")
public class PostApi {
    @Autowired
    private PostService postService;

    @GetMapping()
    public List<PostDTO> getAll() {
        return PostParser.ToListDTO(postService.getAll());
    }

    @PostMapping()
    public ResponseEntity postOne(@RequestBody PostEntity post, @PathVariable("files") MultipartFile[] files) {
        if (postService.createOne(post, files) == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);

        return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponsibilityMessage.CreatingSuccessfully);
    }

    @PutMapping("/Reaction/{postId}")
    public ResponseEntity reactionPost(@PathVariable("postId") Long postId,@RequestBody PostReactionEntity postReaction){
        postReaction.setPost(new PostEntity());
        postReaction.getPost().setId(postId);

        if(postService.reactionPost(postReaction)==null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);

        return ResponseEntity.status(200).body(BaseResponsibilityMessage.UpdatingSuccessfully);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity deleteOne(@PathVariable("postId") Long postId) {
        if (postService.deleteOne(postId) == false)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);

        return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponsibilityMessage.DeletingSuccessfully);
    }
}
