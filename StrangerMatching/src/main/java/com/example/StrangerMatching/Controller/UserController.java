package com.example.StrangerMatching.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

    @GetMapping("/User/Profile")
    public String UserProfile(){
        return "User/profile";
    }
}
