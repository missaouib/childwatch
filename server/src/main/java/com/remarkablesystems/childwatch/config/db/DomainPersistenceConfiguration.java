package com.remarkablesystems.childwatch.config.db;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "domainEntityManagerFactory",
        transactionManagerRef = "domainTransactionManager",
        basePackages = {"com.remarkablesystems.childwatch.domain"})
public class DomainPersistenceConfiguration {
	
    @Bean
    @Primary
    @Qualifier("domain")
    @ConfigurationProperties("childwatch.datasource.domain")
    public DataSource domainDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    @Primary
    @Qualifier("domain")
    public LocalContainerEntityManagerFactoryBean domainEntityManagerFactory(
            EntityManagerFactoryBuilder builder, @Qualifier("domain") DataSource dataSource) {
        Map<String, Object> props = new HashMap<>();
        props.put("hibernate.physical_naming_strategy", SpringPhysicalNamingStrategy.class.getName());
        return builder
                .dataSource(dataSource)
                .packages("com.remarkablesystems.childwatch.domain")
                .persistenceUnit("domain")
                .properties(props)
                .build();
    }

    @Bean
    @Primary
    @Qualifier("domain")
    public PlatformTransactionManager domainTransactionManager(
            @Qualifier("domain") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}
