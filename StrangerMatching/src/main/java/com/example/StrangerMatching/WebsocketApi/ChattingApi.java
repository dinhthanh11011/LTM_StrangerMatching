package com.example.StrangerMatching.WebsocketApi;

import com.example.StrangerMatching.CurrentData.UserMatchingStorage;
import com.example.StrangerMatching.DTO.UserDTO;
import com.example.StrangerMatching.Entity.MessageEntity;
import com.example.StrangerMatching.Parser.MessageParser;
import com.example.StrangerMatching.Service.MessageService;
import com.example.StrangerMatching.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
public class ChattingApi {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/Register")
    @SendTo(WebSocketCommon.USER_ONLINE_URL)
    public List<UserDTO> Register(@Payload String email, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("email", email);
        headerAccessor.getSessionAttributes().put("User", userService.getOneByEmail(email));
        if (!UserMatchingStorage.getInstance().checkUserOnlineByEmail(email)) {
            UserMatchingStorage.getInstance().getUsersOnlineSHA().add(headerAccessor);
        }
        return UserMatchingStorage.getInstance().getListUserDTOOnline();
    }

    @MessageMapping("/Chat/{to}") // to = email
    public void sendMessage(@DestinationVariable String to, @Payload MessageEntity message) {
        message.setSendTo(userService.getOneByEmail(to));
        message.setSendFrom(userService.getOneByEmail(message.getSendFrom().getEmail()));
        message.setCreatedDate(new Date());
        MessageEntity nMess = messageService.createOne(message);
        if (nMess != null) {
            if (message.getImages() == null)
                message.setImages(new ArrayList<>());

            if (UserMatchingStorage.getInstance().checkUserOnlineByEmail(to) == true)
                simpMessagingTemplate.convertAndSend(WebSocketCommon.CHATTING_URL + to, MessageParser.ToDTO(nMess));
        }
    }


}
