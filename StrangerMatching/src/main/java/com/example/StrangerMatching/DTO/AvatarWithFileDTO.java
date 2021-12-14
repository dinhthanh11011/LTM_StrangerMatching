package com.example.StrangerMatching.DTO;

import org.springframework.web.multipart.MultipartFile;

public class AvatarWithFileDTO {
    private String displayName;
    private MultipartFile file;

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
