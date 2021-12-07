package com.example.StrangerMatching.Service;

import com.example.StrangerMatching.Repository.IPostImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostImageService {
    @Autowired
    private IPostImageRepository iPostImageRepository;


}
