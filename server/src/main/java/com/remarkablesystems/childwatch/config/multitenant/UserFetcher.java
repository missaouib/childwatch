package com.remarkablesystems.childwatch.config.multitenant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.remarkablesystems.childwatch.users.User;
import com.remarkablesystems.childwatch.users.UserRepository;

@Component
public class UserFetcher extends UnboundTenantTask<User>{

	public boolean byUserId = false;
	
    @Autowired
    private UserRepository userRepo;

    @Override
    protected User callInternal() {
        User user = (byUserId) ? userRepo.findOne(this.userId) : userRepo.findByUsernameAndPassword(this.username,this.password);
        return user;
    }
	

}
