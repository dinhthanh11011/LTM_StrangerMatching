package com.example.StrangerMatching.CurrentData;

import com.example.StrangerMatching.DTO.UserDTO;
import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Parser.UserParser;
import com.example.StrangerMatching.Service.UserService;
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
            UserDTO dto = UserParser.ToDTO((UserEntity)socket.getSessionAttributes().get("User"));
            dtos.add(dto);
        }
        return dtos;
    }

    public boolean checkUserOnlineByEmail(String email) {
        for (SimpMessageHeaderAccessor userOnline : usersOnlineSHA) {
            if (userOnline.getSessionAttributes().get("email").equals(email))
                return true;
        }
        return false;
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
                usersOnlineSHA.remove(user);
                break;
            }
        }
    }
}
