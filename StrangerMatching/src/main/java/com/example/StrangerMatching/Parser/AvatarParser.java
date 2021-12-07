package com.example.StrangerMatching.Parser;

import com.example.StrangerMatching.DTO.AvatarDTO;
import com.example.StrangerMatching.Entity.AvatarEntity;

import java.util.ArrayList;
import java.util.List;

public class AvatarParser {
    public static AvatarDTO ToDTO(AvatarEntity avatar){
        return new AvatarDTO(avatar.getId(), avatar.getName());
    }

    public static List<AvatarDTO> ToListDTO(List<AvatarEntity> avatars){
        List<AvatarDTO> dtos = new ArrayList<>();
        for (AvatarEntity avatar:avatars) {
            dtos.add(ToDTO(avatar));
        }
        return dtos;
    }
}
