package com.example.StrangerMatching.Api;

import com.example.StrangerMatching.DTO.GenderDTO;
import com.example.StrangerMatching.Parser.GenderParser;
import com.example.StrangerMatching.Service.GenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/Gender")
public class GenderApi {
    @Autowired
    private GenderService genderService;

    @GetMapping()
    public List<GenderDTO> getAll(){
        return GenderParser.ToListDTO(genderService.getAll());
    }
}
