package com.example.StrangerMatching.DTO;

public class TokenDTO {
    private String token;
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public TokenDTO(String token, String email) {
        this.token = token;
        this.email = email;
    }

    public TokenDTO() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
