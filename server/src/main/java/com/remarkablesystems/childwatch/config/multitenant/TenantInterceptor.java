package com.remarkablesystems.childwatch.config.multitenant;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

@Component
public class TenantInterceptor extends HandlerInterceptorAdapter {

    Logger logger = LoggerFactory.getLogger(getClass());
    
    
    String checkForTenant( HttpServletRequest request ) {
    	String tenant = request.getHeader(TenantContext.TENANT_HEADER);
    	if( StringUtils.isEmpty(tenant) ) tenant = request.getParameter("tenant");
    	if( StringUtils.isEmpty(tenant) ) {
    		Cookie[] cookies = request.getCookies();
    		if( cookies != null )
    			for (Cookie cookie : cookies) 
    				if( cookie.getName() == "childwatch-tenant" ) tenant = cookie.getValue();
    	}
    	
    	return tenant;
    }
    
    String checkForUser( HttpServletRequest request ) {
    	String user = request.getHeader(TenantContext.USER_HEADER );
    	if( StringUtils.isEmpty(user) ) user = request.getParameter("user");
    	if( StringUtils.isEmpty(user) ) {
    		Cookie[] cookies = request.getCookies();
    		if( cookies != null )
    			for (Cookie cookie : cookies) 
    				if( cookie.getName() == "childwatch-user" ) user = cookie.getValue();
    	}
    	
    	return user;    	
    }
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse res, Object handler) throws Exception {
    	
    	boolean tenantSet = false;
    	
    	String tenant = checkForTenant(request);
    	String user = checkForUser(request);
    	
        if(StringUtils.isEmpty(tenant) ) {       
          res.setStatus(HttpServletResponse.SC_FORBIDDEN);
          res.setContentType(MediaType.APPLICATION_JSON_VALUE);
          res.getWriter().write("{\"error\": \"No tenant supplied\"}");
          res.getWriter().flush();
        } else {
          TenantContext.setCurrentTenant(tenant);
          if( !StringUtils.isEmpty(user) ) TenantContext.setCurrentUser(user);
          tenantSet = true;
        }
        return tenantSet;    
    }
    
    @Override
    public void postHandle( HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        TenantContext.clear();
    }    
    
}