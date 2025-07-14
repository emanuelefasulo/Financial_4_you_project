package com.financial.forYou.controller;


import com.financial.forYou.exception.DatabaseException;
import com.financial.forYou.model.User;
import com.financial.forYou.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/private/")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable Long id) {
        try {
            return userService.getUserById(id);
        }catch (DatabaseException e) {
            log.error(e.getMessage());
            throw new DatabaseException("Si é verificato un errore interno, riprovare!!!", e);
        }
    }


}
