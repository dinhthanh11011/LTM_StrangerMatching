package com.example.StrangerMatching.DTO;

import com.example.StrangerMatching.Common.FunctionSupport;
import com.example.StrangerMatching.Entity.GenderEntity;
import com.example.StrangerMatching.Entity.UserEntity;

public class UserDTO {
    private String email;
    private String name;
    private String story;
    private String avatar;
    private int age;
    private int agePreferenceForm;
    private int agePreferenceTo;
    private GenderDTO gender;
    private GenderDTO genderPreference;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getAgePreferenceForm() {
        return agePreferenceForm;
    }

    public void setAgePreferenceForm(int agePreferenceForm) {
        this.agePreferenceForm = agePreferenceForm;
    }

    public int getAgePreferenceTo() {
        return agePreferenceTo;
    }

    public void setAgePreferenceTo(int agePreferenceTo) {
        this.agePreferenceTo = agePreferenceTo;
    }

    public GenderDTO getGender() {
        return gender;
    }

    public void setGender(GenderDTO gender) {
        this.gender = gender;
    }

    public GenderDTO getGenderPreference() {
        return genderPreference;
    }

    public void setGenderPreference(GenderDTO genderPreference) {
        this.genderPreference = genderPreference;
    }

    public UserDTO() {
    }

    public static boolean userInfoValidation(UserEntity user) {
        if (!FunctionSupport.emailValidate(user.getEmail())
                || user.getAge() <= 0
                || user.getName().isEmpty()
                || user.getPassword().isEmpty()
        )
            return false;
        return true;
    }
}
