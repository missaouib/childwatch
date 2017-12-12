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
	
	
	User handleUserToken( String token ) {
		String userId = decodeToken( token );
		User user = null;
		
		if( userId != null  ) {
			try {
				userFetcher.byUserId = true;
				userFetcher.setUserId(userId);
				ExecutorService es = Executors.newSingleThreadExecutor();
	            Future<User> utrFuture = es.submit(userFetcher);
	            user = utrFuture.get();				
				if( user != null ) {
					TenantContext.setCurrentTenant(user.tenant.id);
				}
			}
			catch( Exception e ) {
				e.printStackTrace();
			}
		}
		
		return user;
		
	}
	
	User handleLogin( String token ) {
		Login login = decode( token );
		User user = null;
		
		if( login != null && !login.password.equals( NO_LOGIN_PASSWORD ) ) {
			try {
				userFetcher.setUsernamePassword(login.username, login.password);
				ExecutorService es = Executors.newSingleThreadExecutor();
	            Future<User> utrFuture = es.submit(userFetcher);
	            user = utrFuture.get();				
				if( user != null ) {
					TenantContext.setCurrentTenant(user.tenant.id);
					//TODO : Log 
				}
			}
			catch( Exception e ) {
				e.printStackTrace();
			}
		}
		
		return user;
	}
	
	User handlePreauth( String token ) {
		
		byte[] decodedBytes = Base64.getUrlDecoder().decode(token);
		String decodedString = new String(decodedBytes);

		String[] splitToken = decodedString.split(":");
		
		if( splitToken.length != 2 )
			return null;
		
		String tenantId = splitToken[0];
		long timestamp =  Long.parseLong( splitToken[1] );
		long dif = Math.abs(timestamp -  new Date().getTime()); 
		
		
		if( checkDiff && dif > allowableDiff ) {
			logger.info("rejecting - timestamp is off by " + dif + " milliseconds" );
			return null;
		}
		
		User user = null;
		try {
			tenantFetcher.setTenant(tenantId);
			ExecutorService es = Executors.newSingleThreadExecutor();
	        Future<Tenant> utrFuture = es.submit(tenantFetcher);
	        Tenant tenant = utrFuture.get();									
					
			if( tenant != null ) {
				user = new User();
				user.fullName = "Admin User";
				user.password = NO_LOGIN_PASSWORD;
				user.id = token;
				user.avatar = "boy-1.svg";
				user.username = "no-login";
				user.authorities.add( "ADMIN" );	
				user.tenant = tenant;
				//TODO : Log 
			}	
		}
		catch( Exception e ) {
			e.printStackTrace();
		}
		return user;		
	}

	
	@RequestMapping( "/user" )
	public ResponseEntity<?> login( 
			@RequestParam(value="token", required=false) String loginToken, 
			@RequestParam(value="tenant",required=false) String tenantToken,
			@RequestParam(value="user", required=false) String userToken ) {

		User user = StringUtils.isEmpty(userToken)? null : handleUserToken( userToken );
		if( loginToken != null ) user = handleLogin( loginToken ); 
		else if( tenantToken != null ) user = handlePreauth( tenantToken );
		return user == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(user);
	}

}
