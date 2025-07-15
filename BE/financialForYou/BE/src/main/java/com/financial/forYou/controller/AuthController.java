package com.financial.forYou.controller;

import com.financial.forYou.model.Account;
import com.financial.forYou.model.dto.LoginRequest;
import com.financial.forYou.model.dto.LoginResponse;
import com.financial.forYou.service.AccountService;
import com.financial.forYou.util.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.financial.forYou.util.TokenBlacklist;


@Slf4j
@RestController
@RequestMapping("api/auth/")
public class AuthController {

    private final AccountService accountService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final TokenBlacklist tokenBlacklist;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, AccountService accountService, TokenBlacklist tokenBlacklist) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.accountService = accountService;
        this.tokenBlacklist = tokenBlacklist;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        Account account = accountService.getAccountByName(request.getUsername());
        LoginResponse loginResponse = new LoginResponse(jwtUtils.generateToken(authentication), account.getUser().getId());
        return loginResponse;
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");
            tokenBlacklist.blacklistToken(token);
            return ResponseEntity.ok("Logged out");
        } else {
            return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
        }
    }

}
