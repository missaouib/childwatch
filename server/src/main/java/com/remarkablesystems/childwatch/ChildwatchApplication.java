package com.remarkablesystems.childwatch;

import com.coxautodev.graphql.tools.GraphQLResolver;
import com.coxautodev.graphql.tools.SchemaParser;
import com.remarkablesystems.childwatch.graphql.CustomScalars;
import graphql.schema.GraphQLSchema;
import graphql.servlet.SimpleGraphQLServlet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.List;

@SpringBootApplication(exclude = {FlywayAutoConfiguration.class})
public class ChildwatchApplication {

    private static final String GRAPHQL_SERVLET_MAPPING = "/graphql/*";

    public static void main(String[] args) {
        SpringApplication.run(ChildwatchApplication.class, args);
    }

    @Autowired
    private List<GraphQLResolver<?>> resolvers;

    @Bean
    public GraphQLSchema graphQLSchema() {
        return SchemaParser.newParser()
                .file("childwatch.graphqls")
                .resolvers(resolvers)
                .scalars(CustomScalars.DATE_SCALAR, CustomScalars.DATE_TIME_SCALAR)
                .build()
                .makeExecutableSchema();
    }

    @Bean
    ServletRegistrationBean graphQLServletRegistrationBean() {
        return new ServletRegistrationBean(new SimpleGraphQLServlet(graphQLSchema()), GRAPHQL_SERVLET_MAPPING);
    }

    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping(GRAPHQL_SERVLET_MAPPING);
            }
        };
    }
}
