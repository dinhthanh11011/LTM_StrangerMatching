package com.example.StrangerMatching.Parser;

import com.example.StrangerMatching.DTO.UserDTO;
import com.example.StrangerMatching.Entity.UserEntity;

import java.util.ArrayList;
import java.util.List;

public class UserParser {
    public static UserDTO ToDTO(UserEntity user) {
        UserDTO dto = new UserDTO();

        dto.setEmail(user.getEmail());
        dto.setName(user.getName());

        dto.setStory(user.getStory());
        dto.setAvatar(AvatarParser.ToDTO(user.getAvatar()));

        dto.setAge(user.getAge());
        dto.setAgePreferenceFrom(user.getAgePreferenceFrom());
        dto.setAgePreferenceTo(user.getAgePreferenceTo());

        dto.setGender(GenderParser.ToDTO(user.getGender()));
        dto.setGenderPreference(GenderParser.ToDTO(user.getGenderPreference()));
        return dto;
    }

    public static List<UserDTO> ToListDTO(List<UserEntity> users) {
        List<UserDTO> dtos = new ArrayList<>();
        for (UserEntity user : users) {
            dtos.add(ToDTO(user));
        }
        return dtos;
    }
}
