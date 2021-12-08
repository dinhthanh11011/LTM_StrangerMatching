package com.example.StrangerMatching.DTO;

import com.example.StrangerMatching.Common.FileUploadSupport;

public class PostImageDTO {
    private Long id;
    private String name;
    private String path;

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

    public PostImageDTO(Long id, String name) {
        this.id = id;
        this.name = name;
        this.path = FileUploadSupport.UPLOAD_FOLDER_NAME+this.name;
    }

    public String getPath() {
        return FileUploadSupport.UPLOAD_FOLDER_NAME+this.name;
    }

    public PostImageDTO() {
    }
}
