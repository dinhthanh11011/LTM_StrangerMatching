package com.example.StrangerMatching.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AccountController {
    @GetMapping("/Login")
    public String Login() {
        return "Account/login";
    }

    @GetMapping("/Register")
    public String Register() {
        return "Account/register";
    }

    @GetMapping("/FogotPassword")
    public String FogotPassword() {
        return "Account/forgotPassword";
    }
}
