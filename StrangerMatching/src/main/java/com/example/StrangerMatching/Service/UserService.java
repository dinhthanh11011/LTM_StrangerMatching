package com.example.StrangerMatching.Service;

import com.example.StrangerMatching.Common.FunctionSupport;
import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private IUserRepository iUserRepository;

    public List<UserEntity> getAll() {
        return iUserRepository.findAll();
    }

    public UserEntity getOneByEmail(String email){
        return iUserRepository.findByEmail(email);
    }

    public UserEntity createOne(UserEntity user) {
        try {
            user.setPassword(FunctionSupport.getMD5(user.getPassword()));
            user.setAgePreferenceFrom(17);
            user.setAgePreferenceTo(35);
            user.setGenderPreference(user.getGender());
            return iUserRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public UserEntity changePassword(String email, String newPassword) {
        try {
            UserEntity user = iUserRepository.findByEmail(email);
            user.setPassword(FunctionSupport.getMD5(newPassword));
            return iUserRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public UserEntity updateInformation(String email, UserEntity newUserInfo) {
        try {
            UserEntity user = iUserRepository.findByEmail(email);
            if (!newUserInfo.getName().isEmpty())
                user.setName(newUserInfo.getName());

            if (!newUserInfo.getStory().isEmpty())
                user.setStory(newUserInfo.getStory());

            if (!newUserInfo.getAvatar().isEmpty())
                user.setAvatar(newUserInfo.getAvatar());

            if (newUserInfo.getAge() > 0)
                user.setAge(newUserInfo.getAge());

            if (newUserInfo.getAgePreferenceFrom() > 0)
                user.setAgePreferenceFrom(newUserInfo.getAgePreferenceFrom());

            if (newUserInfo.getAgePreferenceTo() > 0)
                user.setAgePreferenceTo(newUserInfo.getAgePreferenceTo());

            if (newUserInfo.getGender() != null)
                user.setGender(newUserInfo.getGender());

            if (newUserInfo.getGenderPreference() != null)
                user.setGenderPreference(newUserInfo.getGenderPreference());

            return iUserRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
