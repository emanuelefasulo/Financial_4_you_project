package com.financial.forYou.exception;

public class AccountNotFoundException extends RuntimeException{
    public AccountNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
