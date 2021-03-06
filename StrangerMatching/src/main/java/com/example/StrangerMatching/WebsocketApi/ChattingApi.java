package com.example.StrangerMatching.WebsocketApi;

import com.example.StrangerMatching.CurrentData.UserMatchingStorage;
import com.example.StrangerMatching.DTO.UserDTO;
import com.example.StrangerMatching.DTO.WebSocketRegisterDTO;
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
    public List<UserDTO> Register(@Payload WebSocketRegisterDTO webSocketRegisterDTO, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("email", webSocketRegisterDTO.getEmail());
        headerAccessor.getSessionAttributes().put("peerId", webSocketRegisterDTO.getPeerId());
        headerAccessor.getSessionAttributes().put(WebSocketCommon.USER_ENTITY_KEY_IN_ONLINE_LIST, userService.getOneByEmail(webSocketRegisterDTO.getEmail()));
        if (UserMatchingStorage.getInstance().getUserOnlineByEmail(webSocketRegisterDTO.getEmail()) == null) {
            UserMatchingStorage.getInstance().getUsersOnlineSHA().add(headerAccessor);
        }

        return UserMatchingStorage.getInstance().getListUserDTOOnline();
    }

    // g???i nh???n tin nh???n
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

    // y??u c???u g??p ????i
    @MessageMapping("/Matching")
    synchronized public void StrangerMatching(@Payload String email) {
        SimpMessageHeaderAccessor userSHA = UserMatchingStorage.getInstance().getUserOnlineByEmail(email);

        if (userSHA != null) {
            UserDTO currentUser = UserParser.ToDTO((UserEntity) userSHA.getSessionAttributes().get(WebSocketCommon.USER_ENTITY_KEY_IN_ONLINE_LIST));
            currentUser.setPeerId(userSHA.getSessionAttributes().get("peerId").toString());
            if (!tryMatching(currentUser)) {
                if (!UserMatchingStorage.getInstance().getUsersWaitingToChatMatching().contains(userSHA)) {
                    UserMatchingStorage.getInstance().getUsersWaitingToChatMatching().add(userSHA);
                }
            }
        }
        simpMessagingTemplate.convertAndSend(WebSocketCommon.TOTAL_WAITING_STRANGER_MATCHING_URL, UserMatchingStorage.getInstance().getUsersWaitingToChatMatching().size());
    }

    // l???y s??? l?????ng ng?????i c???n g??p ????i
    @MessageMapping("/TotalStrangerMatching")
    public void getTotalStrangerMatching() {
        simpMessagingTemplate.convertAndSend(WebSocketCommon.TOTAL_WAITING_STRANGER_MATCHING_URL, UserMatchingStorage.getInstance().getUsersWaitingToChatMatching().size());
    }

    private boolean tryMatching(UserDTO currentUser) {
        // sau khi nh???n y??u c???u g??p ????i th?? ki???m tra trong danh s??ch nh???ng ng?????i ??ang ch??? g??p ????i xem c?? ai ph?? h???p kh??ng
        // n???u c?? th?? gh??p ????i v???i ng?????i ???? lu??n, n???u kh??ng th?? th??m user n??y v??o danh s??ch ch??? gh??p ????i
        for (SimpMessageHeaderAccessor item : UserMatchingStorage.getInstance().getUsersWaitingToChatMatching()) {
            UserEntity item_user = (UserEntity) item.getSessionAttributes().get(WebSocketCommon.USER_ENTITY_KEY_IN_ONLINE_LIST);
            if (item_user.getGender().getId() == currentUser.getGenderPreference().getId()
                    && item_user.getAge() >= currentUser.getAgePreferenceFrom()
                    && item_user.getAge() <= currentUser.getAgePreferenceTo()
                    && currentUser.getGender().getId() == item_user.getGenderPreference().getId()
                    && currentUser.getAge() >= item_user.getAgePreferenceFrom()
                    && currentUser.getAge() <= item_user.getAgePreferenceTo()
            ) {
                UserDTO item_userDTO = UserParser.ToDTO(item_user);
                item_userDTO.setPeerId(item.getSessionAttributes().get("peerId").toString());

                simpMessagingTemplate.convertAndSend(WebSocketCommon.STRANGER_MATCHING_URL + currentUser.getEmail(), item_userDTO);
                simpMessagingTemplate.convertAndSend(WebSocketCommon.STRANGER_MATCHING_URL + item_user.getEmail(), currentUser);
                UserMatchingStorage.getInstance().getUsersWaitingToChatMatching().remove(item);
                return true;
            }
        }
        return false;
    }

}
