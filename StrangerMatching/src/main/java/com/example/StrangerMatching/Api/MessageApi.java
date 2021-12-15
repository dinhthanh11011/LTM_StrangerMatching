package com.example.StrangerMatching.Api;

import com.example.StrangerMatching.DTO.MessageDTO;
import com.example.StrangerMatching.Parser.MessageParser;
import com.example.StrangerMatching.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/Message")
public class MessageApi {
    @Autowired
    private MessageService messageService;

    @GetMapping("")
    public List<MessageDTO> getChat(@RequestParam("emailOne") String emailOne,@RequestParam("emailTwo") String emailTwo){
        return MessageParser.ToListDTO(messageService.getAllMessageByTwoUserEmail(emailOne,emailTwo));
    }
}
