package com.example.StrangerMatching.Api;

import com.example.StrangerMatching.Common.BaseResponsibilityMessage;
import com.example.StrangerMatching.Common.FunctionSupport;
import com.example.StrangerMatching.DTO.PasswordDTO;
import com.example.StrangerMatching.DTO.TokenDTO;
import com.example.StrangerMatching.DTO.UserDTO;
import com.example.StrangerMatching.Entity.UserEntity;
import com.example.StrangerMatching.Parser.UserParser;
import com.example.StrangerMatching.Service.MailSending.EmailSendingService;
import com.example.StrangerMatching.Service.UserService;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

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


    @GetMapping("/Info")
    public ResponseEntity getUserLoginInfo(@RequestParam String email) {
        UserEntity user = userService.getOneByEmail(email);
        if (user == null)
            return ResponseEntity.status(404).body("Not found");
        return ResponseEntity.status(200).body(UserParser.ToDTO(user));
    }

    @PostMapping("/Register")
    public ResponseEntity postOne(@RequestBody UserEntity user, HttpServletRequest request) {
        if (!UserDTO.userInfoValidation(user))
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(BaseResponsibilityMessage.InformationIsNotCorrect);

        UserEntity ckUser = userService.getOneByEmail(user.getEmail());

        if (ckUser != null && ckUser.isEmailConfirm())
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(BaseResponsibilityMessage.EmailWasUsed);

        String token = RandomString.make(45);
        user.setEmailConfirmToken(token);

        if (userService.createOne(user) == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);
        }

//        String AccountActiveLink = FunctionSupport.getSiteURL(request) + "/api/User/Register/Confirm/" + token;
//        emailSendingService.sendSimpleEmail(user.getEmail(),
//                "<p>Click to the link to active your account:</p> <a href=" + AccountActiveLink +
//                        ">Active</a><p>Sorry about this inconvenience</p>",
//                ""
//        );
        return ResponseEntity.status(200).body(BaseResponsibilityMessage.CheckYourMailbox);
    }

    @GetMapping("/Register/Confirm/{token}")
    public ResponseEntity emailConfirm(@PathVariable("token") String token) {
        UserEntity user = userService.getOneByEmailConfirmToken(token);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BaseResponsibilityMessage.NotFound);

        if (userService.activeAccount(user.getEmail()) == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);
        return ResponseEntity.status(200).body(BaseResponsibilityMessage.UpdatingSuccessfully);
    }

    @PostMapping(value = "/Login")
    public ResponseEntity login(@RequestBody UserEntity user) {
        UserEntity userEntity = userService.getOneByEmail(user.getEmail());
        if (userEntity == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BaseResponsibilityMessage.NotFound);

        if (!userEntity.getPassword().equals(FunctionSupport.getMD5(user.getPassword())))
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(BaseResponsibilityMessage.InformationIsNotCorrect);

//        if (!userEntity.isEmailConfirm())
//            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(BaseResponsibilityMessage.CheckYourMailToConfirmAccountBeforeLogin);

        return ResponseEntity.status(200).body(new TokenDTO("acasfsdg", user.getEmail()));
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

    @PostMapping("/FogotPassword")
    public ResponseEntity fogotPassword(@RequestBody UserEntity userET, HttpServletRequest request) {
        UserEntity user = userService.getOneByEmail(userET.getEmail());
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BaseResponsibilityMessage.NotFound);

        String token = RandomString.make(45);
        user.setResetPasswordToken(token);

        if (userService.updateInformation(user.getEmail(), user) != null) {
            String resetPasswordLink = FunctionSupport.getSiteURL(request) + "/api/User/resetPassword/" + token;

            emailSendingService.sendSimpleEmail(user.getEmail(),
                    "<p>We will send a new password to your mail after you click to th link:</p><a href=" + resetPasswordLink +
                            "> ResetPassword </a><p>Please change it to your own password, sorry about this inconvenience</p>",
                    ""
            );
            return ResponseEntity.status(200).body(BaseResponsibilityMessage.CheckYourMailbox);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);
    }

    @GetMapping("/resetPassword/{token}")
    public ResponseEntity resetPassword(@PathVariable("token") String token) {
        UserEntity user = userService.getOneByResetPasswordToken(token);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BaseResponsibilityMessage.NotFound);

        String nPassword = RandomString.make(8);
        // set new random token
        user.setResetPasswordToken(RandomString.make(45));
        user.setPassword(FunctionSupport.getMD5(nPassword));

        if (userService.updateInformation(user.getEmail(), user) != null) {
            emailSendingService.sendSimpleEmail(user.getEmail(),
                    "<p>Your new password is: " + nPassword + "</p>" +
                            "<p>Please change it to your own password, sorry about this inconvenience</p>",
                    ""
            );
            return ResponseEntity.status(200).body(BaseResponsibilityMessage.CheckYourMailbox);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);
    }

    @PutMapping("/Information/{email}")
    public ResponseEntity updateInformation(@PathVariable(name = "email") String email, @RequestBody UserEntity newUserInfo) {
        if (userService.updateInformation(email, newUserInfo) == null)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponsibilityMessage.SomethingWentWrong);

        return ResponseEntity.status(200).body(BaseResponsibilityMessage.UpdatingSuccessfully);
    }
}
