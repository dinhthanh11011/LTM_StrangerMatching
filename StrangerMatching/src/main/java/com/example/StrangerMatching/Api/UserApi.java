package com.example.StrangerMatching.Api;

import com.example.StrangerMatching.Common.BaseResponsibilityMessage;
import com.example.StrangerMatching.Common.FunctionSupport;
import com.example.StrangerMatching.CurrentData.UserMatchingStorage;
import com.example.StrangerMatching.DTO.PasswordDTO;
import com.example.StrangerMatching.DTO.TokenDTO;
import com.example.StrangerMatching.DTO.UserDTO;
import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Parser.UserParser;
import com.example.StrangerMatching.Service.EmailSendingService;
import com.example.StrangerMatching.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.parser.Entity;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/User")
public class UserApi {
    @Autowired
    private UserService userService;

    @Autowired
    private EmailSendingService emailSendingService;

    @GetMapping()
    public List<UserDTO> getAll() {
        return UserParser.ToListDTO(userService.getAll());
    }

    @PostMapping("/Register")
    public ResponseEntity postOne(@RequestBody UserEntity user) {
        if (!UserDTO.userInfoValidation(user))
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(BaseResponsibilityMessage.InformationIsNotCorrect);

        if (userService.getOneByEmail(user.getEmail()) != null)
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(BaseResponsibilityMessage.EmailWasUsed);

        if (userService.createOne(user) == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);

        return ResponseEntity.status(HttpStatus.CREATED).body(BaseResponsibilityMessage.CreatingSuccessfully);
    }

    @PostMapping("/Login")
    public ResponseEntity login(@RequestBody UserEntity user) {
        UserEntity userEntity = userService.getOneByEmail(user.getEmail());
        if (userEntity == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BaseResponsibilityMessage.NotFound);

        if (!userEntity.getPassword().equals(FunctionSupport.getMD5(user.getPassword())))
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(BaseResponsibilityMessage.InformationIsNotCorrect);

        return ResponseEntity.status(200).body(new TokenDTO("acasfsdg"));
    }

    @PutMapping("/ChangePassword/{email}")
    public ResponseEntity changePassword(@PathVariable(name = "email") String email, @RequestBody PasswordDTO passwordDTO) {
        UserEntity user = userService.getOneByEmail(email);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BaseResponsibilityMessage.NotFound);

        if (!user.getPassword().equals(FunctionSupport.getMD5(passwordDTO.getOldPassword())))
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(BaseResponsibilityMessage.InformationIsNotCorrect);

        if (userService.changePassword(email, passwordDTO.getNewPassword()) == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);

        return ResponseEntity.status(200).body(BaseResponsibilityMessage.UpdatingSuccessfully);
    }

    @PostMapping("/FogetPassword")
    public ResponseEntity fogetPassword(@RequestBody UserEntity userET) {
        UserEntity user = userService.getOneByEmail(userET.getEmail());
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BaseResponsibilityMessage.NotFound);

        int minLen = 100000000;
        int RdPassword = (new Random().nextInt(1000000000 - minLen)) + minLen;

        emailSendingService.sendSimpleEmail(user.getEmail(),
                "Your new password is: " + RdPassword + "\nPlease change it to your own password, sorry about this inconvenience",
                ""
        );

        userService.changePassword(user.getEmail(), FunctionSupport.getMD5(RdPassword + ""));
        return ResponseEntity.status(200).body(BaseResponsibilityMessage.UpdatingSuccessfully);
    }

    @PutMapping("/Information/{email}")
    public ResponseEntity updateInformation(@PathVariable(name = "email") String email, @RequestBody UserEntity newUserInfo) {
        if (userService.updateInformation(email, newUserInfo) == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);

        return ResponseEntity.status(200).body(BaseResponsibilityMessage.UpdatingSuccessfully);
    }
}
