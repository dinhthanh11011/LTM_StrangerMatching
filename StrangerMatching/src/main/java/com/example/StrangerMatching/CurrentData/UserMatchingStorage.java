package com.example.StrangerMatching.CurrentData;

import com.example.StrangerMatching.DTO.UserDTO;
import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Parser.UserParser;
import com.example.StrangerMatching.Service.UserService;
import com.example.StrangerMatching.WebsocketApi.WebSocketCommon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;

import java.util.ArrayList;
import java.util.List;

public class UserMatchingStorage {

    private UserMatchingStorage() {
    }

    private static UserMatchingStorage Instance;

    public static UserMatchingStorage getInstance() {
        if (Instance == null) {
            Instance = new UserMatchingStorage();
        }
        return Instance;
    }

    //=====================================================================
    private List<SimpMessageHeaderAccessor> usersWaitingToChatMatching = new ArrayList<>();
    private List<SimpMessageHeaderAccessor> usersOnlineSHA = new ArrayList<>();


    public List<SimpMessageHeaderAccessor> getUsersOnlineSHA() {
        return usersOnlineSHA;
    }

    public List<SimpMessageHeaderAccessor> getUsersWaitingToChatMatching() {
        return usersWaitingToChatMatching;
    }

    public List<UserDTO> getListUserDTOOnline(){
        List<UserDTO> dtos = new ArrayList<>();
        for (SimpMessageHeaderAccessor socket:usersOnlineSHA) {
            UserDTO dto = UserParser.ToDTO((UserEntity)socket.getSessionAttributes().get(WebSocketCommon.USER_ENTITY_KEY_IN_ONLINE_LIST));
            dto.setPeerId(socket.getSessionAttributes().get("peerId").toString());
            dtos.add(dto);
        }
        return dtos;
    }

    public SimpMessageHeaderAccessor getUserOnlineByEmail(String email) {
        for (int i = 0; i < usersOnlineSHA.size(); i++) {
            if (usersOnlineSHA.get(i).getSessionAttributes().get("email").equals(email))
                return usersOnlineSHA.get(i);
        }
        return null;
    }

    public void disconnectUserBySessionId(String sessionId) {
        for (SimpMessageHeaderAccessor user : usersOnlineSHA) {
            if (user.getSessionId().equals(sessionId)) {
                usersOnlineSHA.remove(user);
                break;
            }
        }

        for (SimpMessageHeaderAccessor user : usersWaitingToChatMatching) {
            if (user.getSessionId().equals(sessionId)) {
                usersWaitingToChatMatching.remove(user);
                break;
            }
        }
    }
}
