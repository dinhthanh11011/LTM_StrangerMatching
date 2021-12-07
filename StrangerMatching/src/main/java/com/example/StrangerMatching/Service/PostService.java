package com.example.StrangerMatching.Service;

import com.example.StrangerMatching.Common.FileUploadSupport;
import com.example.StrangerMatching.Entity.PostEntity;
import com.example.StrangerMatching.Entity.PostImageEntity;
import com.example.StrangerMatching.Entity.PostReactionEntity;
import com.example.StrangerMatching.Repository.IPostCommentRepository;
import com.example.StrangerMatching.Repository.IPostImageRepository;
import com.example.StrangerMatching.Repository.IPostReactionRepository;
import com.example.StrangerMatching.Repository.IPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Date;
import java.util.List;

@Service
public class PostService {
    @Autowired
    private IPostRepository iPostRepository;

    @Autowired
    private IPostImageRepository iPostImageRepository;

    @Autowired
    private IPostReactionRepository iPostReactionRepository;

    @Autowired
    private IPostCommentRepository iPostCommentRepository;

    public List<PostEntity> getAll() {
        return iPostRepository.findAllByOrderByCreatedDateDesc();
    }

    public PostEntity getOneById(Long postId) {
        return iPostRepository.getById(postId);
    }

    public PostEntity createOne(PostEntity post, MultipartFile[] files) {
        try {
            post.setCreatedDate(new Date());
            PostEntity createdPost = iPostRepository.save(post);
            if (files != null && files.length > 0) {
                for (MultipartFile file : files) {
                    File up = FileUploadSupport.uploadOne(file);
                    if (up != null) {
                        iPostImageRepository.save(new PostImageEntity(up.getName(), post));
                    }
                }
            }
            return createdPost;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public PostReactionEntity reactionPost(PostReactionEntity postReaction) {
        try {
            PostReactionEntity pre = iPostReactionRepository.findByIdAndUser_Email(postReaction.getId(), postReaction.getUser().getEmail());
            if (pre != null){
                iPostRepository.deleteById(pre.getId());
                return postReaction;
            }

            return iPostReactionRepository.save(postReaction);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean deleteOne(Long postId) {
        try {
            for (PostImageEntity postImage : iPostImageRepository.deleteAllByPost_Id(postId)) {
                FileUploadSupport.deleteOneByName(postImage.getName());
            }
            iPostReactionRepository.deleteAllByPost_Id(postId);
            iPostCommentRepository.deleteAllByPost_Id(postId);
            iPostRepository.deleteById(postId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
