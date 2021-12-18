package com.example.StrangerMatching.WebsocketApi;

import com.example.StrangerMatching.CurrentData.UserMatchingStorage;
import com.example.StrangerMatching.DTO.UserDTO;
import com.example.StrangerMatching.Entity.AvatarEntity;
import com.example.StrangerMatching.Entity.GenderEntity;
import com.example.StrangerMatching.Entity.MessageEntity;
import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Parser.MessageParser;
import com.example.StrangerMatching.Parser.UserParser;
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
        headerAccessor.getSessionAttributes().put(WebSocketCommon.USER_ENTITY_KEY_IN_ONLINE_LIST, userService.getOneByEmail(email));
        if (UserMatchingStorage.getInstance().getUserOnlineByEmail(email) == null) {
            UserMatchingStorage.getInstance().getUsersOnlineSHA().add(headerAccessor);
        }

        return UserMatchingStorage.getInstance().getListUserDTOOnline();
    }

    // gửi nhận tin nhắn
    @MessageMapping("/Message/{to}") // to = email
    public void sendMessage(@DestinationVariable String to, @Payload MessageEntity message) {
        message.setSendTo(userService.getOneByEmail(to));
        message.setSendFrom(userService.getOneByEmail(message.getSendFrom().getEmail()));
        message.setCreatedDate(new Date());
        MessageEntity nMess = messageService.createOne(message);
        if (nMess != null) {
            if (message.getImages() == null)
                message.setImages(new ArrayList<>());

            if (UserMatchingStorage.getInstance().getUserOnlineByEmail(to) != null)
                simpMessagingTemplate.convertAndSend(WebSocketCommon.CHATTING_URL + to, MessageParser.ToDTO(nMess));
        }
    }

    // yêu cầu gép đôi
    @MessageMapping("/Matching")
    public void StrangerMatching(@Payload String email) {
        SimpMessageHeaderAccessor userSHA = UserMatchingStorage.getInstance().getUserOnlineByEmail(email);

        if (userSHA != null) {
            UserEntity currentUser = (UserEntity) userSHA.getSessionAttributes().get(WebSocketCommon.USER_ENTITY_KEY_IN_ONLINE_LIST);
            if (!tryMatching(currentUser)) {
                if (!UserMatchingStorage.getInstance().getUsersWaitingToChatMatching().contains(userSHA)) {
                    UserMatchingStorage.getInstance().getUsersWaitingToChatMatching().add(userSHA);
                }
            }
        }
        simpMessagingTemplate.convertAndSend(WebSocketCommon.TOTAL_WAITING_STRANGER_MATCHING_URL, UserMatchingStorage.getInstance().getUsersWaitingToChatMatching().size());
    }

    // lấy số lượng người cần gép đôi
    @MessageMapping("/TotalStrangerMatching")
    public void getTotalStrangerMatching() {
        simpMessagingTemplate.convertAndSend(WebSocketCommon.TOTAL_WAITING_STRANGER_MATCHING_URL, UserMatchingStorage.getInstance().getUsersWaitingToChatMatching().size());
    }

    private boolean tryMatching(UserEntity currentUser) {
        // sau khi nhận yêu cầu gép đôi thì kiểm tra trong danh sách những người đang chờ gép đôi xem có ai phù hợp không
        // nếu có thì ghép đôi với người đó luôn, nếu không thì thêm user này vào danh sách chờ ghép đôi
        for (SimpMessageHeaderAccessor item : UserMatchingStorage.getInstance().getUsersWaitingToChatMatching()) {
            UserEntity item_user = (UserEntity) item.getSessionAttributes().get(WebSocketCommon.USER_ENTITY_KEY_IN_ONLINE_LIST);
            if (item_user.getGender().getId() == currentUser.getGenderPreference().getId()
                    && item_user.getAge() >= currentUser.getAgePreferenceFrom()
                    && item_user.getAge() <= currentUser.getAgePreferenceTo()
                    && currentUser.getGender().getId() == item_user.getGenderPreference().getId()
                    && currentUser.getAge() >= item_user.getAgePreferenceFrom()
                    && currentUser.getAge() <= item_user.getAgePreferenceTo()
            ) {
                simpMessagingTemplate.convertAndSend(WebSocketCommon.STRANGER_MATCHING_URL + currentUser.getEmail(), UserParser.ToDTO(item_user));
                simpMessagingTemplate.convertAndSend(WebSocketCommon.STRANGER_MATCHING_URL + item_user.getEmail(), UserParser.ToDTO(currentUser));
                UserMatchingStorage.getInstance().getUsersWaitingToChatMatching().remove(item);
                return true;
            }
        }
        return false;
    }

}
