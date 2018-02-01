package com.remarkablesystems.childwatch.users;

import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.remarkablesystems.childwatch.config.multitenant.TenantContext;
import com.remarkablesystems.childwatch.config.multitenant.TenantFetcher;
import com.remarkablesystems.childwatch.config.multitenant.UserFetcher;

@RestController
public class UserController {
	
	static final String NO_LOGIN_PASSWORD = "===no-login-from-this-account==";
	
	
	static final int allowableDiff = 10000; // 10 seconds 

	static Logger logger = LoggerFactory.getLogger(UserController.class);
	
	boolean checkDiff = true;
	
	@Autowired
	UserFetcher userFetcher;
	
	@Autowired
	TenantFetcher tenantFetcher;
		
	
	class Login {
		String username = null;
		String password = null;
		
		Login( String user, String password ){
			this.username = user;
			this.password = password;
		}
		
	};
	
	String decodeToken( String token ) {
		byte[] decodedBytes = Base64.getUrlDecoder().decode(token);
		String decodedString = new String(decodedBytes);

		String[] splitToken = decodedString.split(":");

		
		
		if( splitToken.length != 2 )
			return null;
		
		String userid = splitToken[0];
		
		long timestamp =  Long.parseLong( splitToken[1] );
		long dif = Math.abs(timestamp -  new Date().getTime()); 
		
		
		if( checkDiff && dif > allowableDiff) {
			logger.info("rejecting - timestamp is off by " + dif + " milliseconds" );
			return null;
		}
		
		return userid;		
	}
	
	
	Login decode( String token ) {
		
		byte[] decodedBytes = Base64.getUrlDecoder().decode(token);
		String decodedString = new String(decodedBytes);

		String[] splitToken = decodedString.split(":");

		
		
		if( splitToken.length != 3 )
			return null;
		
		String username = splitToken[0];
		String password = splitToken[1];
		
		if( password == null ) return null;

		long timestamp =  Long.parseLong( splitToken[2] );
		Date asDate = new Date( timestamp );
		
		long dif = Math.abs(timestamp -  new Date().getTime()); 
		
		
		if( checkDiff && dif > allowableDiff) {
			logger.info("rejecting - timestamp is off by " + dif + " milliseconds" );
			return null;
		}
		
		return new Login( username, password );
	}
	
		
	User handleLogin( String token ) {
		Login login = decode( token );
		User user = null;
		
		if( login != null && !login.password.equals( NO_LOGIN_PASSWORD ) ) {
			try {
				userFetcher.setUsername(login.username);
				userFetcher.setPassword(login.password);
				ExecutorService es = Executors.newSingleThreadExecutor();
	            Future<User> utrFuture = es.submit(userFetcher);
	            user = utrFuture.get();				
				if( user != null ) {
					TenantContext.setCurrentTenant(user.tenant.id);
					logger.info("User id:{} logged in", user.id );
				}
				else {
					logger.info( "rejected a login attempt for {}", login  != null ? login.username : null );
				}
			}
			catch( Exception e ) {
				e.printStackTrace();
			}
		}
		
		return user;
	}
	
	String convertNull( String str ) {
		return ( str == null || "null".equalsIgnoreCase(str) )? null : str; 
	}
	
	/**
	 * Handler for preauthorization requests
	 * 
	 * @param token
	 * @return
	 */
	User handlePreauth( String token ) {
		
		byte[] decodedBytes = Base64.getUrlDecoder().decode(token);
		String decodedString = new String(decodedBytes);

		String[] splitToken = decodedString.split(":");
		
		if( splitToken.length != 9 )
			return null;
		
		String accountId = convertNull(splitToken[0]);
		String userId = convertNull(splitToken[1]);
		boolean adminUser = !"false".equalsIgnoreCase( convertNull(splitToken[2]) );
		String[] ageGroups = ( convertNull(splitToken[3]) != null )? splitToken[3].split(",") : new String[0] ;
		String[] mealTypes = ( convertNull(splitToken[4]) != null )? splitToken[4].split(",") : new String[0];
		String theme = convertNull(splitToken[5]);
		String accountName = convertNull(splitToken[6]);
		String userName = convertNull(splitToken[7]);
		
		
		logger.info( "accountId = {}; userId = {}; adminUser = {}; ageGroups= {}; theme= {}", accountId, userId, adminUser, ageGroups, theme );
		
		long timestamp =  Long.parseLong( convertNull(splitToken[8]) );
		long dif = Math.abs(timestamp -  new Date().getTime()); 
		
		
		if( checkDiff && dif > allowableDiff ) {
			logger.info("rejecting - timestamp is off by " + dif + " milliseconds" );
			return null;
		}
		
		User user = null;
		try {
			tenantFetcher.setAccountID(accountId);
			tenantFetcher.setUserID(userId);
			tenantFetcher.setAdminUser(adminUser);
			tenantFetcher.setAgeGroups(ageGroups);
			tenantFetcher.setMealTypes(mealTypes);
			tenantFetcher.setTheme(theme);
			tenantFetcher.setAccountName(accountName);
			tenantFetcher.setName(userName);
			tenantFetcher.setRecreateUser(true);
			
			ExecutorService es = Executors.newSingleThreadExecutor();
	        Future<Tenant> tenantFuture = es.submit(tenantFetcher);
	        
	        // get or create a tenant
	        @SuppressWarnings("unused") Tenant tenant = tenantFuture.get();	
	        
	        
			
	        userFetcher.byUserId = true;
	        userFetcher.setUserID(userId != null && userId.length() > 0 ? userId : accountId );
	        Future<User> userFuture = es.submit(userFetcher);
	        user = userFuture.get();	  
	        if( user != null ) {
				TenantContext.setCurrentTenant(user.tenant.id);
				logger.info("User id:{} logged in", user.id );
			}
	        
		}
		catch( Exception e ) {
			e.printStackTrace();
		}
		return user;		
	}
	

	
	@GetMapping( "/user" )
	public ResponseEntity<?> login( 
			@RequestParam(value="token", required=false) String loginToken, 
			@RequestParam(value="preauth", required=false ) String preauthToken ) {
		
		User user = null;
		if( loginToken != null ) user = handleLogin( loginToken ); 
		else if( preauthToken != null ) user = handlePreauth( preauthToken );
		
		return user == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(user);
	}
	
}
