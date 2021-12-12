package com.example.StrangerMatching.WebsocketApi;

import com.example.StrangerMatching.CurrentData.UserMatchingStorage;
import com.example.StrangerMatching.Entity.MessageEntity;
import com.example.StrangerMatching.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChattingApi {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private UserService userService;


    @MessageMapping("/Register")
    public void Register(@Payload String email, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("email", email);
        UserMatchingStorage.getInstance().getUsersOnlineSHA().add(headerAccessor);
        System.out.println("user: "+email);
    }

    @MessageMapping("/chat/{to}")
    public void sendMessage(@DestinationVariable String to, MessageEntity message) {
        System.out.println("handling send message: " + message + " to: " + to);
        if (UserMatchingStorage.getInstance().findUserOnlineByEmail(to)==true) {
            simpMessagingTemplate.convertAndSend("/topic/messages/" + to, message);
        }
    }


}
