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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.remarkablesystems.childwatch.config.db.multitenant.TenantContext;
import com.remarkablesystems.childwatch.config.db.multitenant.UserFetcher;

@RestController
public class UserController {

	Logger logger = LoggerFactory.getLogger(UserController.class);
	
	@Autowired
	UserFetcher userFetcher;
		
	
	class Login {
		String username = null;
		String password = null;
		
		Login( String user, String password ){
			this.username = user;
			this.password = password;
		}
		
	};
	
	
	Login decode( String token ) {
		
		
		
		
		byte[] decodedBytes = Base64.getUrlDecoder().decode(token);
		String decodedString = new String(decodedBytes);

		String[] splitToken = decodedString.split(":");

		
		
		if( splitToken.length != 3 )
			return null;
		
		String username = splitToken[0];
		String password = splitToken[1];
		

		long timestamp =  Long.parseLong( splitToken[2] );
		Date asDate = new Date( timestamp );
		
		long dif = Math.abs(timestamp -  new Date().getTime()); 
		
		/*
		if( dif > 1000 ) {
			logger.info("rejecting - timestamp is off by " + dif + " milliseconds" );
			return null;
		}
		*/
		
		
		logger.info("decoded u: " + username + "; p: " + password  + "; t: " + timestamp +"; d: " + asDate +"; dif: " + dif );
		
		
		return new Login( username, password );
	}
	
	
	User handleLogin( String token ) {
		Login login = decode( token );
		User user = null;
		
		if( login != null  ) {
			try {
				userFetcher.setUsernamePassword(login.username, login.password);
				ExecutorService es = Executors.newSingleThreadExecutor();
	            Future<User> utrFuture = es.submit(userFetcher);
	            user = utrFuture.get();				
				if( user != null ) {
					logger.info( "found user = " + user.id + " tenant = " + user.tenant.id );
					TenantContext.setCurrentTenant(user.tenant.id);
					logger.info( "userCtrl set tenant to " + user.tenant.id );
				}
			}
			catch( Exception e ) {
				e.printStackTrace();
			}
		}
		
		return user;
	}
	
	User handlePreauth( String token ) {
		User user = null;
		/*
		try {
			tenantFetcher.setTenant(token);
			ExecutorService es = Executors.newSingleThreadExecutor();
	        Future<Tenant> utrFuture = es.submit(tenantFetcher);
	        Tenant tenant = utrFuture.get();				
			
			
			logger.info("tenant = " + tenant );
					
			if( tenant != null ) {
				user = new User();
				user.fullName = "Admin User";
				user.password = "no-login-from-this-account";
				user.id = token;
				user.avatar = "boy-1.svg";
				user.username = "no-login";
				user.authorities.add( "ADMIN" );	
				user.tenant = tenant;
			}	
		}
		catch( Exception e ) {
			e.printStackTrace();
		}
		*/
		return user;		
	}

	
	@RequestMapping( "/user" )
	public ResponseEntity<?> login( 
			@RequestParam(value="token", required=false) String loginToken, 
			@RequestParam(value="tenant",required=false) String tenantToken ) {

		User user = null;
		if( loginToken != null ) user = handleLogin( loginToken ); 
		else if( tenantToken != null ) user = handlePreauth( tenantToken );
		return user == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(user);
	}

}
