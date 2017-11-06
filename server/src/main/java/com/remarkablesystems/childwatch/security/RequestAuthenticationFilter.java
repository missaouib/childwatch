package com.remarkablesystems.childwatch.security;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedCredentialsNotFoundException;

public class RequestAuthenticationFilter extends AbstractPreAuthenticatedProcessingFilter {

	@Override
	protected Object getPreAuthenticatedPrincipal(HttpServletRequest request) {
		
		String cwid = null;
		
		Cookie[] cookies = request.getCookies();
		
		for( Cookie ck : cookies ) {
			if( ck.getName().equals("CW_ID") ) {
				cwid = ck.getValue();
			}
		}
		
		if( cwid == null )
			throw new PreAuthenticatedCredentialsNotFoundException("authentication token not found in request.");
		
		return cwid;
	}

	@Override
	protected Object getPreAuthenticatedCredentials(HttpServletRequest request) {
		return "N/A";
	}

}
