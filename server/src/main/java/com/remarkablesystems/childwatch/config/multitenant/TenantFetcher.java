package com.remarkablesystems.childwatch.config.multitenant;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.remarkablesystems.childwatch.users.Tenant;
import com.remarkablesystems.childwatch.users.TenantRepository;

@Component
public class TenantFetcher extends UnboundTenantTask<Tenant>{

	Logger logger = LoggerFactory.getLogger(TenantFetcher.class.getName());
	
    @Autowired
    private TenantRepository tenantRepo;

    @Override
    protected Tenant callInternal() {
        Tenant tenant = tenantRepo.findOne(tenantId);
        if( tenant == null ) {
        	logger.info( "Tenant " + tenantId + " not found; creating " );
        	tenant = new Tenant( tenantId, tenantId );
        	tenantRepo.save(tenant);
        }
        return tenant;
    }
	

}
