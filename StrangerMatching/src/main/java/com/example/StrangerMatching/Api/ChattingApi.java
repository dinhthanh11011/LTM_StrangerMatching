package com.example.StrangerMatching.Api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChattingApi {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
}
