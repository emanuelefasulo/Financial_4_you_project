package com.financial.forYou.service;

import com.financial.forYou.exception.AccountNotFoundException;
import com.financial.forYou.model.Account;
import com.financial.forYou.repository.AccountRepository;
import org.springframework.stereotype.Service;


@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account getAccountByName(String username) throws AccountNotFoundException{
        return accountRepository.findByUsername(username).orElse(null);
    }

    public Account createAccount(Account account) throws AccountNotFoundException{
        return accountRepository.saveAndFlush(account);
    }

    public Account updateAccount(Account account) throws AccountNotFoundException{
        return accountRepository.saveAndFlush(account);
    }

}
