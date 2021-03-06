package com.example.StrangerMatching.Service;

import com.example.StrangerMatching.Common.FileUploadSupport;
import com.example.StrangerMatching.DTO.AvatarWithFileDTO;
import com.example.StrangerMatching.Entity.AvatarEntity;
import com.example.StrangerMatching.Repository.IAvatarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@Service
public class AvatarService {
    @Autowired
    private IAvatarRepository iAvatarRepository;

    public List<AvatarEntity> getAll() {
        return iAvatarRepository.findAll();
    }

    public AvatarEntity createOne(AvatarWithFileDTO avatar) {
        try {
            File up = FileUploadSupport.uploadOne(avatar.getFile());
            return iAvatarRepository.save(new AvatarEntity(up.getName(), avatar.getDisplayName()));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    public boolean deleteOneById(Long avatarid) {
        try {
            AvatarEntity ava = iAvatarRepository.getById(avatarid);
            iAvatarRepository.deleteById(ava.getId());
            FileUploadSupport.deleteOneByName(ava.getName());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
