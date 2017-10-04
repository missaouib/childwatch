package com.remarkablesystems.childwatch.config.db;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

@Component
@Order(Integer.MIN_VALUE)
public class DatabaseMigration {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DataSource domainDataSource;
    private final DataSource usersDataSource;

    private boolean domainMigrationExecuted;
    private boolean usersMigrationExecuted;
    
    @Value("${wipe.database:false}")
    private boolean wipe;

    public DatabaseMigration(
            @Qualifier("domain") DataSource domainDataSource,
            @Qualifier("users") DataSource usersDataSource) {
        this.domainDataSource = domainDataSource;
        this.usersDataSource = usersDataSource;
    }

    @PostConstruct
    public void migrate() {
        // This runs before Axon initialization, so that its machinery does not do any work on a database before it's
        // initialized or wiped. However, the demo data generator needs to run after Axon, so at this time all we can
        // do is leave a flag for it to check: domainMigrationExecuted.
        domainMigrationExecuted = migrate(domainDataSource, "domain") > 0;
        usersMigrationExecuted = migrate(usersDataSource, "users") > 0;
    }

    private int migrate(DataSource dataSource, String schema) {

        Flyway flyway = new Flyway();
        flyway.setDataSource(dataSource);
        flyway.setLocations("schema." + schema);
        flyway.setSchemas(schema);
        if (wipe) {
        	flyway.setValidateOnMigrate(false);
            logger.info("Wiping schema: " + schema);
            flyway.clean();
        }
        else {
        	logger.info("Schema " + schema + " will not be wiped" );
        }
        logger.info("Migrating schema: " + schema);
        return flyway.migrate();
    }

    public boolean domainMigrationExecuted() {
        return domainMigrationExecuted;
    }

    public boolean usersMigrationExecuted() {
        return usersMigrationExecuted;
    }
}
