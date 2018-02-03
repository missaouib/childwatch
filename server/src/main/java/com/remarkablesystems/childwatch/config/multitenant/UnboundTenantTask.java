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
    @Setter protected boolean recreateUser = false;
    @Setter protected boolean showWeekends = false;
            
    
    public void clear() {
    	username = null;
    	password = null;
    	accountID = null;
    	userID = null;
    	adminUser = false;
    	ageGroups = null;
    	mealTypes = null;
    	theme = null;
    	accountName = null;
    	name = null;
    	recreateUser = false;
    	showWeekends = false;
    }

    @Override
    public T call() throws Exception {
        return callInternal();
    }

    protected abstract T callInternal();
}
