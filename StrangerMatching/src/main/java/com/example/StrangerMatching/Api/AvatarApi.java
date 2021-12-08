package com.example.StrangerMatching.Api;

import com.example.StrangerMatching.Common.BaseResponsibilityMessage;
import com.example.StrangerMatching.DTO.AvatarDTO;
import com.example.StrangerMatching.Parser.AvatarParser;
import com.example.StrangerMatching.Service.AvatarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/Avatar")
public class AvatarApi {
    @Autowired
    private AvatarService avatarService;

    @GetMapping()
    public List<AvatarDTO> getAll() {
        return AvatarParser.ToListDTO(avatarService.getAll());
    }

    @PostMapping()
    public ResponseEntity postOne(@PathVariable(name = "file") MultipartFile file) {
        if (avatarService.createOne(file) == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);
        return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponsibilityMessage.CreatingSuccessfully);
    }

    @DeleteMapping("/{avatarId}")
    public ResponseEntity deleteOne(@PathVariable(name = "avatarId") Long avatarId) {
        if (!avatarService.deleteOneById(avatarId))
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);
        return ResponseEntity.status(200).body(BaseResponsibilityMessage.DeletingSuccessfully);
    }
}
