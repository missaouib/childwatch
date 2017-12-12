package com.remarkablesystems.childwatch.config.multitenant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TenantContext {
	
	public static final String DEFAULT_USER_ID = null;
	public static final String DEFAULT_TENANT_ID = "common";
	public static final String TENANT_HEADER = "X-CHILDWATCH-TENANT";
	public static final String USER_HEADER = "X-CHILDWATCH-USER";
	

    @SuppressWarnings("unused")
	private static Logger logger = LoggerFactory.getLogger(TenantContext.class.getName());

    private static ThreadLocal<String> currentUser = new ThreadLocal<String>() {
        @Override
        protected String initialValue() {
          return DEFAULT_USER_ID;
        }    	
    };
    
    private static ThreadLocal<String> currentTenant = new ThreadLocal<String>(){
        @Override
        protected String initialValue() {
          return DEFAULT_TENANT_ID;
        }
      };
      
    public static void setCurrentUser( String user ) {
    	currentUser.set( user );
    }
      
    public static void setCurrentTenant(String tenant) {
        currentTenant.set(tenant);
    }
    
    public static String getCurrentUser() {
    	return currentUser.get();
    }
    
    public static String getCurrentTenant() {
        return currentTenant.get();
    }
    
    public static void clear() {
        currentTenant.remove();
        currentUser.remove();
    }

}
