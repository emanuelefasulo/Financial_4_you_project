package com.financial.forYou.controller;

import com.financial.forYou.exception.AccountNotFoundException;
import com.financial.forYou.model.Account;
import com.financial.forYou.service.AccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/public/")
@CrossOrigin(origins = "*")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/insert-account")
    public ResponseEntity<?> createAccount(@RequestBody Account account) {
        try {
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            account.setPassword(passwordEncoder.encode(account.getPassword()));
            Account savedAccount = accountService.createAccount(account);
            return ResponseEntity.ok(savedAccount);
        } catch (AccountNotFoundException e) {
            log.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create account"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Account accountInput) {
        try {
            Account accountInDb = accountService.getAccountByName(accountInput.getUsername());
            if (accountInDb != null && accountInDb.getKey_recovery().equals(accountInput.getKey_recovery())) {
                PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                String encodedPassword = passwordEncoder.encode(accountInput.getPassword());
                accountInDb.setPassword(encodedPassword);
                accountService.updateAccount(accountInDb);
                return ResponseEntity.ok("Password resettata con successo");
            } else {
                return ResponseEntity.ok("Parola chiave errata, non è possibile resettare la password");
            }
        } catch (AccountNotFoundException e) {
            log.error(e.getMessage());
            throw new AccountNotFoundException("Account non trovato", e);
        }
    }

}
