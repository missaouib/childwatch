package com.remarkablesystems.childwatch;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebConfiguration extends WebMvcConfigurerAdapter {
    public static final String INDEX_VIEW_NAME = "forward:index.html";

    // This makes Spring serve index.html in response to /, /schedule, etc. without redirecting the browser or making
    // it change the URL in any way. IOW it's more like a transparent "proxy" than an invasive redirect.
    @Override
    public void addViewControllers(final ViewControllerRegistry registry) {    	
        registry.addViewController("/").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/schedule").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/family").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/meals").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/billing").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/login").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/admin").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/admin/food-items").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/dashboard").setViewName(INDEX_VIEW_NAME);        
        registry.addViewController("/room").setViewName(INDEX_VIEW_NAME);      
        registry.addViewController("/meals/menu-overview").setViewName(INDEX_VIEW_NAME);      
        registry.addViewController("/meals/menu/{spring:\\\\w+}").setViewName(INDEX_VIEW_NAME);      
        registry.addViewController("/meals/meal").setViewName(INDEX_VIEW_NAME);      
        registry.addViewController("/child-detail").setViewName(INDEX_VIEW_NAME);      
    }
}