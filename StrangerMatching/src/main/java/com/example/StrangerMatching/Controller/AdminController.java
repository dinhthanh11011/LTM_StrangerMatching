package com.example.StrangerMatching.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {
    @GetMapping("/admin/Avatar")
    public String Avatar(){
        return "admin_avatar";
    }
}
