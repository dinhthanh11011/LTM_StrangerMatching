package com.example.StrangerMatching.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity(name = "message")
public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "text",columnDefinition = "text")
    private String text;

    @Column(name = "created_date",nullable = false)
    private Date createdDate;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "send_from", referencedColumnName = "Email",nullable = false)
    private UserEntity sendFrom;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "send_to", referencedColumnName = "Email",nullable = false)
    private UserEntity sendTo;

    @OneToMany(mappedBy = "message", cascade = CascadeType.REMOVE)
    @JsonManagedReference
    @JsonIgnore
    private List<MessageImageEntity> images;

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

    public UserEntity getSendFrom() {
        return sendFrom;
    }

    public void setSendFrom(UserEntity sendFrom) {
        this.sendFrom = sendFrom;
    }

    public UserEntity getSendTo() {
        return sendTo;
    }

    public void setSendTo(UserEntity sendTo) {
        this.sendTo = sendTo;
    }

    public List<MessageImageEntity> getImages() {
        return images;
    }

    public void setImages(List<MessageImageEntity> images) {
        this.images = images;
    }

    public MessageEntity() {
    }
}
