package com.remarkablesystems.childwatch.config.multitenant;

import java.util.concurrent.Callable;

import lombok.Setter;


public abstract class UnboundTenantTask<T> implements Callable<T> {

    @Setter protected String username;
    @Setter protected String password;
    
    @Setter protected String accountID;
    @Setter protected String userID;
    @Setter protected boolean adminUser;
    @Setter protected String[] ageGroups;
    @Setter protected String[] mealTypes;
    @Setter protected String theme;
    @Setter protected String accountName;
    @Setter protected String name;
            

    @Override
    public T call() throws Exception {
        return callInternal();
    }

    protected abstract T callInternal();
}
