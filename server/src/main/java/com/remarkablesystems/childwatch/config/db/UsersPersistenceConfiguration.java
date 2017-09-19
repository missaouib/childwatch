package com.remarkablesystems.childwatch.config.db;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
public class UsersPersistenceConfiguration {
    @Bean
    @Qualifier("users")
    @ConfigurationProperties("childwatch.datasource.users")
    public DataSource usersDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    @Qualifier("users")
    public PlatformTransactionManager usersTransactionManager() {
        return new DataSourceTransactionManager(usersDataSource());
    }
}
