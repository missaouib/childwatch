package com.remarkablesystems.childwatch.config.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
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
        registry.addViewController("/meals").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/login").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/meals/meal-calendar").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/meals/meal-builder").setViewName(INDEX_VIEW_NAME);
        registry.addViewController("/meals/food-editor").setViewName(INDEX_VIEW_NAME);        
        registry.addViewController("/meals/{spring:\\\\w+}").setViewName(INDEX_VIEW_NAME);      
    }
    
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
    configurer.favorPathExtension(false).
            favorParameter(true).
            defaultContentType(MediaType.TEXT_HTML);
      }
}