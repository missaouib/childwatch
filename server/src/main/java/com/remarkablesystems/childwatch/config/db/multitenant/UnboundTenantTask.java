package com.remarkablesystems.childwatch.config.db.multitenant;

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
        //TenantContext.setCurrentTenant(TenantContext.DEFAULT_TENANT_ID);
        return callInternal();
    }

    protected abstract T callInternal();
}
