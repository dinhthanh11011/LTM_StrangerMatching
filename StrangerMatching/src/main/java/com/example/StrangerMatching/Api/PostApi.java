package com.example.StrangerMatching.Api;

import com.example.StrangerMatching.Common.BaseResponsibilityMessage;
import com.example.StrangerMatching.Common.FunctionSupport;
import com.example.StrangerMatching.DTO.PostCommentDTO;
import com.example.StrangerMatching.DTO.PostDTO;
import com.example.StrangerMatching.DTO.PostWithFilesDTO;
import com.example.StrangerMatching.Entity.PostCommentEntity;
import com.example.StrangerMatching.Entity.PostEntity;
import com.example.StrangerMatching.Entity.PostReactionEntity;
import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Parser.PostCommentParser;
import com.example.StrangerMatching.Parser.PostParser;
import com.example.StrangerMatching.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Post")
public class PostApi {
    @Autowired
    private PostService postService;

    @GetMapping()
    public List<PostDTO> getAll(@Nullable @RequestParam("email") String email) {
        if (email == null)
            return PostParser.ToListDTO(postService.getAll());
        else
            return PostParser.ToListDTO(postService.getAllByEmail(email));
    }


    @PostMapping(value = "")
    public ResponseEntity postOne(@ModelAttribute PostWithFilesDTO post) {
        PostEntity nPost = new PostEntity();
        nPost.setCaption(post.getCaption());
        nPost.setUser(new UserEntity(FunctionSupport.getCurrentUserEmail()));
        if (postService.createOne(nPost, post.getFiles()) == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);

        return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponsibilityMessage.CreatingSuccessfully);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity deleteOne(@PathVariable("postId") Long postId) {
        String email = FunctionSupport.getCurrentUserEmail();
        PostEntity currentPost = postService.getOneById(postId);
        if(currentPost==null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.NotFound);

        if(!currentPost.getUser().getEmail().equals(email))
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.YouAreNotAllow);

        if (postService.deleteOne(postId) == false)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);

        return ResponseEntity.status(200).body(BaseResponsibilityMessage.DeletingSuccessfully);
    }


    // React post
    //=================================================================================
    @PostMapping("/Reaction")
    public ResponseEntity reactionPost(@RequestBody PostReactionEntity postReaction) {
        postReaction.setUser(new UserEntity(FunctionSupport.getCurrentUserEmail()));
        if (postService.reactionPost(postReaction) == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);

        return ResponseEntity.status(200).body(BaseResponsibilityMessage.UpdatingSuccessfully);
    }

    // comment post
    //=================================================================================
    @PostMapping("/Comment")
    public ResponseEntity commentPost(@RequestBody PostCommentEntity comment) {
        comment.setUser(new UserEntity(FunctionSupport.getCurrentUserEmail()));
        if (postService.commentPost(comment) == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);

        return ResponseEntity.status(200).body(BaseResponsibilityMessage.UpdatingSuccessfully);
    }

    @GetMapping("/Comment/{postId}")
    public List<PostCommentDTO> getAllCommentPost(@PathVariable("postId") Long postId) {
        return PostCommentParser.ToListDTO(postService.getAllPostComment(postId));
    }


}
