package com.remarkablesystems.childwatch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration;


@SpringBootApplication(exclude = {FlywayAutoConfiguration.class})
public class ChildwatchApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChildwatchApplication.class, args);
    }

}
