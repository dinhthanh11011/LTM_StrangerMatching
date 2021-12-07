package com.example.StrangerMatching.Parser;

import com.example.StrangerMatching.DTO.GenderDTO;
import com.example.StrangerMatching.Entity.GenderEntity;

import java.util.ArrayList;
import java.util.List;

public class GenderParser {
    public static GenderDTO ToDTO(GenderEntity gender){
        return new GenderDTO(gender.getId(),gender.getName());
    }

    public static List<GenderDTO> ToListDTO(List<GenderEntity> genders){
        List<GenderDTO> dtos = new ArrayList<>();
        for (GenderEntity gender:genders) {
            dtos.add(ToDTO(gender));
        }
        return dtos;
    }
}
