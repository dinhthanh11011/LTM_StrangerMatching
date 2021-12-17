package com.example.StrangerMatching.Controller;

import com.example.StrangerMatching.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class MessageController {
    @Autowired
    private UserService userService;

    @GetMapping("/Message/{email}")
    public String Chatting(@PathVariable("email") String email, Model model) {
        if(userService.getOneByEmail(email)==null)
            throw  new ResponseStatusException(HttpStatus.NOT_FOUND);
        model.addAttribute("user_sendTo", email);
        return "Message/MessageOne";
    }

    @GetMapping("/Message")
    public String Chatting() {
        return "Message/message";
    }
}
