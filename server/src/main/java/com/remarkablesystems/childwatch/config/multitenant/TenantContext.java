package com.remarkablesystems.childwatch.config.multitenant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TenantContext {
	
	public static final String DEFAULT_TENANT_ID = "common";
	public static final String TOKEN_HEADER = "X-CHILDWATCH-TENANT";

    private static Logger logger = LoggerFactory.getLogger(TenantContext.class.getName());
    private static ThreadLocal<String> currentTenant = new ThreadLocal<String>(){
        @Override
        protected String initialValue() {
          return DEFAULT_TENANT_ID;
        }
      };
      
    public static void setCurrentTenant(String tenant) {
        logger.info("TC::Setting tenant to " + tenant);
        currentTenant.set(tenant);
    }
    public static String getCurrentTenant() {
        return currentTenant.get();
    }
    public static void clear() {
    	logger.info("TC::clearing tenant (was " + getCurrentTenant() + " )");
        currentTenant.remove();
    }

}
