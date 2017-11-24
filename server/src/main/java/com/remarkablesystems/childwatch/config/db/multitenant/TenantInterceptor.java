package com.remarkablesystems.childwatch.config.db.multitenant;

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
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse res, Object handler) throws Exception {
    	String tenant = request.getHeader(TenantContext.TOKEN_HEADER);
        boolean tenantSet = false;

        if(StringUtils.isEmpty(tenant)) {
          res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
          res.setContentType(MediaType.APPLICATION_JSON_VALUE);
          res.getWriter().write("{\"error\": \"No tenant supplied\"}");
          res.getWriter().flush();
        } else {
          TenantContext.setCurrentTenant(tenant);
          tenantSet = true;
        }
        logger.info( "preHandle:: tenant = " + TenantContext.getCurrentTenant() );
        return tenantSet;    
    }
    
    @Override
    public void postHandle( HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        TenantContext.clear();
    }    
    
}