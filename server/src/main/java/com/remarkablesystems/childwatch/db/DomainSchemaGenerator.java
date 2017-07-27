package com.remarkablesystems.childwatch.db;

import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.boot.spi.MetadataImplementor;
import org.hibernate.dialect.PostgreSQL94Dialect;
import org.hibernate.tool.hbm2ddl.SchemaExport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManagerFactory;
import javax.persistence.metamodel.EntityType;
import javax.sql.DataSource;

/**
 * When the "development" profile is active, this class generates Hibernate schema to build/domain_schema.sql. It can be
 * later fed to Flyway for migrations.
 */
@Component
@Profile("development")
public class DomainSchemaGenerator {
    public static final String OUTPUT_FILE = "build/domain_schema.sql";
    private final DataSource dataSource;
    private final EntityManagerFactory entityManagerFactory;

    @Autowired
    public DomainSchemaGenerator(@Qualifier("domain") DataSource dataSource,
                                 EntityManagerFactory entityManagerFactory) {
        this.dataSource = dataSource;
        this.entityManagerFactory = entityManagerFactory;
    }

    @PostConstruct
    public void generate() {
        MetadataSources metadata = new MetadataSources(
                new StandardServiceRegistryBuilder()
                        .applySetting("hibernate.dialect", PostgreSQL94Dialect.class)
                        .applySetting(
                                "hibernate.physical_naming_strategy",
                                SpringPhysicalNamingStrategy.class.getName())
                        .build()
        );
        for (EntityType<?> entityType : entityManagerFactory.getMetamodel().getEntities()) {
            metadata.addAnnotatedClass(entityType.getJavaType());
        }
        metadata.addPackage("org.springframework.data.jpa.convert.threeten");

        /*
        SchemaExport schemaExport = new SchemaExport((MetadataImplementor) metadata.buildMetadata());
        schemaExport.setDelimiter(";");
        schemaExport.setOutputFile(OUTPUT_FILE);
        schemaExport.setFormat(true);
        schemaExport.execute(true, false, false, true);
        */
    }
}
