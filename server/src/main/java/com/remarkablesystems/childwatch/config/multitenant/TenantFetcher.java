package com.remarkablesystems.childwatch.config.multitenant;


import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.remarkablesystems.childwatch.users.Tenant;
import com.remarkablesystems.childwatch.users.TenantRepository;
import com.remarkablesystems.childwatch.users.User;
import com.remarkablesystems.childwatch.users.UserRepository;

@Component
public class TenantFetcher extends UnboundTenantTask<Tenant>{

	Logger logger = LoggerFactory.getLogger(TenantFetcher.class.getName());
	
    @Autowired private TenantRepository tenantRepo;
    
    @Autowired UserRepository userRepo;

    @Override
    protected Tenant callInternal() {
        Tenant tenant = tenantRepo.findOne( accountID );
        if( tenant == null ) {
        	tenant = Tenant.builder()
        				.id(accountID)
        				.name(accountName != null && accountName.length() > 0  ? accountName : accountID )
        				.supportingAge0_5MO( !Arrays.asList(ageGroups).contains("AGE_0_5MO") )
        				.supportingAge6_11MO( !Arrays.asList(ageGroups).contains("AGE_6_11MO") )
        				.supportingAge1YR( !Arrays.asList(ageGroups).contains("AGE_1YR") )
        				.supportingAge2YR( !Arrays.asList(ageGroups).contains("AGE_2YR") )
        				.supportingAge3_5YR( !Arrays.asList(ageGroups).contains("AGE_3_5YR") )
        				.supportingAge6_12YR( !Arrays.asList(ageGroups).contains("AGE_6_12YR") )
        				.supportingAge13_18YR( !Arrays.asList(ageGroups).contains("AGE_13_18YR") )
        				.supportingAgeAdult( !Arrays.asList(ageGroups).contains("AGE_ADULT") )
        				.supportingBreakfast( !Arrays.asList(mealTypes).contains("B"))
        				.supportingAMSnack( !Arrays.asList(mealTypes).contains("A"))
        				.supportingLunch( !Arrays.asList(mealTypes).contains("L"))
        				.supportingPMSnack( !Arrays.asList(mealTypes).contains("P"))
        				.supportingSupper( !Arrays.asList(mealTypes).contains("S"))
        				.supportingEVSnack( !Arrays.asList(mealTypes).contains("E"))
        				.active(true)
        				.build();
        	tenantRepo.save(tenant);
        	logger.info("Creating tenant {}", tenant.getName() );
        }
        else {
        	tenant.setName( accountName != null && accountName.length() > 0  ? accountName : accountID );
			tenant.setSupportingAge0_5MO( !Arrays.asList(ageGroups).contains("AGE_0_5MO") );
			tenant.setSupportingAge6_11MO( !Arrays.asList(ageGroups).contains("AGE_6_11MO") );
			tenant.setSupportingAge1YR( !Arrays.asList(ageGroups).contains("AGE_1YR") );
			tenant.setSupportingAge2YR( !Arrays.asList(ageGroups).contains("AGE_2YR") );
			tenant.setSupportingAge3_5YR( !Arrays.asList(ageGroups).contains("AGE_3_5YR") );
			tenant.setSupportingAge6_12YR( !Arrays.asList(ageGroups).contains("AGE_6_12YR") );
			tenant.setSupportingAge13_18YR( !Arrays.asList(ageGroups).contains("AGE_13_18YR") );
			tenant.setSupportingAgeAdult( !Arrays.asList(ageGroups).contains("AGE_ADULT") );
			tenant.setSupportingBreakfast( !Arrays.asList(mealTypes).contains("B"));
			tenant.setSupportingAMSnack( !Arrays.asList(mealTypes).contains("A"));
			tenant.setSupportingLunch( !Arrays.asList(mealTypes).contains("L"));
			tenant.setSupportingPMSnack( !Arrays.asList(mealTypes).contains("P"));
			tenant.setSupportingSupper( !Arrays.asList(mealTypes).contains("S"));
			tenant.setSupportingEVSnack( !Arrays.asList(mealTypes).contains("E"));
			
			
			logger.info("Found tenant {} for id {}", tenant.getName(), tenant.getId() );
			tenant = tenantRepo.save(tenant);
        }
        
        if( tenant != null ) {
	        // if there isnt a user id - use the tenant id
	        if( userID == null ) userID = accountID;  
	        User user = userRepo.findOne( userID );
	        
	        
	        // if we don't have a user; create one...
	        if( user == null ) {
	        	        	
	        	user = User.builder()
	        			.id(userID)
	        			.username( userID )
	        			.fullName( name != null && name.length() > 0 ? name : "USER" )
	        			.theme( theme != null && theme.length() > 0 ? theme : "readable" )
	        			.weekendsShowing(showWeekends)
	        			.tenant(tenant)
	        			.build();
	        	if( this.adminUser ) user.addAuthority("ADMIN");
	        	userRepo.save(user);
	        	logger.info( "Creating user {} for {}", user.getId(), tenant.getName() );
	        }
	        else {
	        	logger.info( "Found user {} old user will retenant to {}", user.getId(), tenant.getName() );

	        	user.setFullName( name != null && name.length() > 0 ? name : "USER" );
	        	user.setTheme( theme != null && theme.length() > 0 ? theme : "readable" );
	        	user.setWeekendsShowing(showWeekends);
		        user.setTenant(tenant);
	        	user = userRepo.save(user);
	        }
        }
        
        clear();
        return tenant;
    }
	

}
