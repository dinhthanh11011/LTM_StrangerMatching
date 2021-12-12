package com.example.StrangerMatching.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
    @GetMapping("/Login")
    public String Login(){
        return "login";
    }

    @GetMapping("/Register")
    public String Register(){
        return "register";
    }


}
