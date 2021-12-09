package com.example.StrangerMatching.CurrentData;

import com.example.StrangerMatching.Entity.UserEntity;

import java.util.ArrayList;
import java.util.List;

public class UserMatchingStorage {
    private UserMatchingStorage() {
    }

    private static UserMatchingStorage Instance;

    public static UserMatchingStorage getInstance() {
        if (Instance == null){
            Instance = new UserMatchingStorage();
        }

        return Instance;
    }

    //=====================================================================
    private List<UserEntity> UsersOnline = new ArrayList<>();
    private List<UserEntity> UsersWaitingToMatching = new ArrayList<>();


    public List<UserEntity> getUsersOnline() {
        return UsersOnline;
    }

    public List<UserEntity> getUsersWaitingToMatching() {
        return UsersWaitingToMatching;
    }
}
