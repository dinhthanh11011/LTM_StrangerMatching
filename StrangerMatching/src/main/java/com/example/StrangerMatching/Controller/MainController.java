package com.example.StrangerMatching.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/")
    public String Home() {
        return "index";
    }

    @GetMapping("/Login")
    public String Login() {
        return "login";
    }

    @GetMapping("/Register")
    public String Register() {
        return "register";
    }

    @GetMapping("/FogotPassword")
    public String FogotPassword() {
        return "forgotPassword";
    }

    @GetMapping("/Chatting/{email}")
    public String Chatting() {
        return "chatting";
    }

}
