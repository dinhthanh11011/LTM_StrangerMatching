package com.example.StrangerMatching.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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
    public String Chatting(@PathVariable("email") String email, Model model) {
        model.addAttribute("user_sendTo", email);
        return "chattingOneByOne";
    }

}
