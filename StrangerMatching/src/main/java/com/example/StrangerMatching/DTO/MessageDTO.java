package com.example.StrangerMatching.DTO;

import com.example.StrangerMatching.Entity.MessageImageEntity;
import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Parser.MessageImageParser;
import com.example.StrangerMatching.Parser.UserParser;

import java.util.Date;
import java.util.List;

public class MessageDTO {
    private Long id;
    private String text;
    private Date createdDate;
    private UserDTO sendFrom;
    private UserDTO sendTo;
    private List<MessageImageDTO> images;

    public MessageDTO(Long id, String text, Date createdDate, UserEntity sendFrom, UserEntity sendTo, List<MessageImageEntity> images) {
        this.id = id;
        this.text = text;
        this.createdDate = createdDate;
        this.sendFrom = UserParser.ToDTO(sendFrom);
        this.sendTo = UserParser.ToDTO(sendTo);;
        this.images = MessageImageParser.ToListDTO(images);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public UserDTO getSendFrom() {
        return sendFrom;
    }

    public void setSendFrom(UserDTO sendFrom) {
        this.sendFrom = sendFrom;
    }

    public UserDTO getSendTo() {
        return sendTo;
    }

    public void setSendTo(UserDTO sendTo) {
        this.sendTo = sendTo;
    }

    public List<MessageImageDTO> getImages() {
        return images;
    }

    public void setImages(List<MessageImageDTO> images) {
        this.images = images;
    }
}
