package com.example.StrangerMatching.DTO;

import com.example.StrangerMatching.Entity.UserEntity;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.Column;
import java.util.Date;

public class PostWithFilesDTO {
    private String caption;
    private MultipartFile[] files;
    private UserEntity user;

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public MultipartFile[] getFiles() {
        return files;
    }

    public void setFiles(MultipartFile[] files) {
        this.files = files;
    }
}
