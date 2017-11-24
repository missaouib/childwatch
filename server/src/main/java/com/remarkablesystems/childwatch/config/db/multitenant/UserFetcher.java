package com.remarkablesystems.childwatch.config.db.multitenant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.remarkablesystems.childwatch.users.User;
import com.remarkablesystems.childwatch.users.UserRepository;

@Component
public class UserFetcher extends UnboundTenantTask<User>{

    @Autowired
    private UserRepository userRepo;

    @Override
    protected User callInternal() {
        User user = userRepo.findByUsernameAndPassword(this.username,this.password);
        return user;
    }
	

}
