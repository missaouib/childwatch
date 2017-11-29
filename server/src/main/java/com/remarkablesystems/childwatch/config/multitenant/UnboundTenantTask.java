package com.remarkablesystems.childwatch.config.multitenant;

import java.util.concurrent.Callable;

public abstract class UnboundTenantTask<T> implements Callable<T> {

    protected String username;
    protected String password;
    protected String tenantId;

    public void setUsernamePassword(String username, String password ) {
        this.username = username;
        this.password = password;
    }
    
    public void setTenant( String tenant ) {
    	this.tenantId = tenant;
    }

    @Override
    public T call() throws Exception {
        return callInternal();
    }

    protected abstract T callInternal();
}
