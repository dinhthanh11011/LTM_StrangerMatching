package com.example.StrangerMatching.Service;

import com.example.StrangerMatching.Common.FileUploadSupport;
import com.example.StrangerMatching.Entity.*;
import com.example.StrangerMatching.Repository.*;
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

    @Autowired
    private IReactionRepository iReactionRepository;

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
            if (files != null && files.length > 0 && !files[0].getOriginalFilename().isEmpty()) {
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


    public boolean deleteOne(Long postId) {
        try {
            for (PostImageEntity postImage : iPostImageRepository.findAllByPost_Id(postId)) {
                FileUploadSupport.deleteOneByName(postImage.getName());
            }
            iPostRepository.deleteById(postId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // React post
    //=================================================================================
    public PostReactionEntity reactionPost(PostReactionEntity postReaction) {
        try {
            if (!iReactionRepository.existsById(postReaction.getReaction().getId()) || !iPostRepository.existsById(postReaction.getPost().getId()))
                return null;

            PostReactionEntity pre = iPostReactionRepository.findByPost_IdAndUser_Email(postReaction.getPost().getId(), postReaction.getUser().getEmail());
            if (pre != null) {
                if (pre.getReaction().getId() != postReaction.getReaction().getId()) {
                    pre.setReaction(postReaction.getReaction());
                    return iPostReactionRepository.save(pre);
                }
                iPostReactionRepository.deleteById(pre.getId());
                return postReaction;
            }

            return iPostReactionRepository.save(postReaction);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // comment post
    //=================================================================================
    public PostCommentEntity commentPost(PostCommentEntity comment) {
        try {
            if (!iPostRepository.existsById(comment.getPost().getId()))
                return null;
            comment.setCreatedDate(new Date());
            return iPostCommentRepository.save(comment);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<PostCommentEntity> getAllPostComment(Long postId) {
        return iPostCommentRepository.findAllByPost_Id(postId);
    }
}
