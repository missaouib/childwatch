package com.remarkablesystems.childwatch.config.multitenant;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.hibernate.HibernateException;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class MultiTenantConnectionProviderImpl implements MultiTenantConnectionProvider {

	private static final long serialVersionUID = -3819945889502397747L;
	
	Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
    private DataSource dataSource;
	
	
    @Override
    public Connection getAnyConnection() throws SQLException {
        return dataSource.getConnection();
    }
    
    @Override
    public void releaseAnyConnection(Connection connection) throws SQLException {
        connection.close();
    }
    
    @Override
    public Connection getConnection(String tenantIdentifier ) throws SQLException {
    	final Connection connection = getAnyConnection();
    	try {
    		connection.createStatement().execute("SET search_path TO '" + tenantIdentifier + "'" );
    	}
    	catch( SQLException e ) {
    		throw new HibernateException( "Could not alter JDBC connection to specified schema [" + tenantIdentifier + "]", e );
    	}
    	return connection;
    }
    
    @Override
    public void releaseConnection(String tenantIdentifier, Connection connection) throws SQLException {
        try {
            connection.createStatement().execute( "SET search_path TO '" + TenantContext.DEFAULT_TENANT_ID + "'");
        }
        catch ( SQLException e ) {
            throw new HibernateException( "Could not alter JDBC connection to specified schema [" + tenantIdentifier + "]", e );
        }
        connection.close();
    }
    
    @SuppressWarnings("rawtypes")
    @Override
    public boolean isUnwrappableAs(Class unwrapType) {
        return false;
    }
    @Override
    public <T> T unwrap(Class<T> unwrapType) {
        return null;
    }
    @Override
    public boolean supportsAggressiveRelease() {
        return true;
    }
}
