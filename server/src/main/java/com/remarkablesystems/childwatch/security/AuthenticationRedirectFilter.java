package com.remarkablesystems.childwatch.security;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static java.util.Arrays.asList;

@Component
public class AuthenticationRedirectFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException,
            ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        boolean anonymous = SecurityContextHolder.getContext().getAuthentication() instanceof
                AnonymousAuthenticationToken;
        String path = httpRequest.getRequestURI();
        if (!anonymous && asList("/", "/login").contains(path)) {
            httpResponse.sendRedirect("/dashboard");
        }
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }
}
