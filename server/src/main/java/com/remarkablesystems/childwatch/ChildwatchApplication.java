package com.remarkablesystems.childwatch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.handler.MappedInterceptor;

import com.remarkablesystems.childwatch.config.multitenant.TenantInterceptor;


@SpringBootApplication(exclude = {FlywayAutoConfiguration.class})
public class ChildwatchApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChildwatchApplication.class, args);
    }
    
    @Bean
    public MappedInterceptor myMappedInterceptor() {
        return new MappedInterceptor(new String[]{"/api/**", "/rules/**", "/menu/**"}, new TenantInterceptor());
    }

}
