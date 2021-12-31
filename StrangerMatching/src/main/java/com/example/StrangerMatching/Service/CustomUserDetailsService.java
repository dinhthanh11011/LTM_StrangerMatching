package com.example.StrangerMatching.Service;

import com.example.StrangerMatching.DTO.CustomUserDetails;
import com.example.StrangerMatching.Entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity userEntity = userService.getOneByEmail(email);
        if (userEntity == null)
            throw new UsernameNotFoundException("User not found");
        return new CustomUserDetails(userEntity);
    }
}
