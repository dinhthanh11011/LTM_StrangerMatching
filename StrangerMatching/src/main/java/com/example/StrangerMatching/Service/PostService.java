package com.example.StrangerMatching.Service;

import com.example.StrangerMatching.Entity.PostEntity;
import com.example.StrangerMatching.Repository.IPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PostService {
    @Autowired
    private IPostRepository iPostRepository;

    public List<PostEntity> getAll(){
        return iPostRepository.findAllByOrderByCreatedDateDesc();
    }

    public PostEntity createOne(PostEntity post){
        post.setTotalLike(0);
        post.setCreatedDate(new Date());
        return iPostRepository.save(post);
    }

    public PostEntity editOne(Long postId, PostEntity newPost){
        return new PostEntity();
    }
}
