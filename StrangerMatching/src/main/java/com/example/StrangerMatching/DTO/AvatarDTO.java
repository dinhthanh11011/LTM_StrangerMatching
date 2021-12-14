package com.example.StrangerMatching.DTO;

import com.example.StrangerMatching.Common.FileUploadSupport;

public class AvatarDTO {
    private Long id;
    private String name;
    private String displayName;
    private String path;

    public AvatarDTO() {
    }

    public AvatarDTO(Long id, String name, String displayName) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.path = FileUploadSupport.UPLOAD_FOLDER_NAME + this.name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return FileUploadSupport.UPLOAD_FOLDER_NAME + this.name;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
