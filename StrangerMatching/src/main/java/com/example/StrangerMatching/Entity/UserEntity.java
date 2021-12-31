package com.example.StrangerMatching.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity(name = "user")
public class UserEntity {
    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name", nullable = false, columnDefinition = "text")
    private String name;

    @Column(name = "story", columnDefinition = "text")
    private String story;

    @Column(name = "reset_password_token", columnDefinition = "text")
    private String resetPasswordToken;

    @Column(name = "age", nullable = false)
    private int age;

    @Column(name = "age_preference_from", nullable = false)
    private int agePreferenceFrom;

    @Column(name = "age_preference_to", nullable = false)
    private int agePreferenceTo;

    @Column(name = "is_email_confirm")
    private boolean isEmailConfirm;

    @Column(name = "email_confirm_token", columnDefinition = "text")
    private String emailConfirmToken;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "avatar_id", referencedColumnName = "id", nullable = false)
    private AvatarEntity avatar;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "gender_id", referencedColumnName = "id", nullable = false)
    private GenderEntity gender;

    @ManyToOne
    @JsonBackReference
    @JsonIgnore
    @JoinColumn(name = "gender_preference_id", referencedColumnName = "id", nullable = false)
    private GenderEntity genderPreference;

    public String getEmailConfirmToken() {
        return emailConfirmToken;
    }

    public void setEmailConfirmToken(String emailConfirmToken) {
        this.emailConfirmToken = emailConfirmToken;
    }

    public boolean isEmailConfirm() {
        return isEmailConfirm;
    }

    public void setEmailConfirm(boolean emailConfirm) {
        isEmailConfirm = emailConfirm;
    }

    public String getResetPasswordToken() {
        return resetPasswordToken;
    }

    public void setResetPasswordToken(String resetPasswordToken) {
        this.resetPasswordToken = resetPasswordToken;
    }

    public UserEntity() {
    }

    public UserEntity(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStory() {
        return story;
    }

    public void setStory(String story) {
        this.story = story;
    }

    public AvatarEntity getAvatar() {
        return avatar;
    }

    public void setAvatar(AvatarEntity avatar) {
        this.avatar = avatar;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getAgePreferenceFrom() {
        return agePreferenceFrom;
    }

    public void setAgePreferenceFrom(int agePreferenceFrom) {
        this.agePreferenceFrom = agePreferenceFrom;
    }

    public int getAgePreferenceTo() {
        return agePreferenceTo;
    }

    public void setAgePreferenceTo(int agePreferenceTo) {
        this.agePreferenceTo = agePreferenceTo;
    }

    public GenderEntity getGender() {
        return gender;
    }

    public void setGender(GenderEntity gender) {
        this.gender = gender;
    }

    public GenderEntity getGenderPreference() {
        return genderPreference;
    }

    public void setGenderPreference(GenderEntity genderPreference) {
        this.genderPreference = genderPreference;
    }
}
