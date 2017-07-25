package com.remarkablesystems.childwatch;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ProtocolResolver;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.UrlResource;
import org.springframework.util.StreamUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;

import javax.annotation.PostConstruct;

@Configuration
public class DevWebConfiguration extends WebMvcConfigurerAdapter {
    private ConfigurableApplicationContext applicationContext;
    
    @Value("${client.host}")
    String clientHost;
    
    @PostConstruct
    public void print() {
      System.out.println( "Client will be at http://" + clientHost);
    }

    public DevWebConfiguration(ConfigurableApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }
        

    // The protocol resolver etc. are only necessary
    // because the CLI returns 404 to HEAD requests. Otherwise this one line would suffice:
    // registry.addResourceHandler("/**").addResourceLocations("http://localhost:4200");
    //
    // Bug in CLI: https://github.com/angular/angular-cli/issues/5170

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        applicationContext.addProtocolResolver(new ProtocolResolver() {

            @Override
            public Resource resolve(String location, ResourceLoader resourceLoader) {
                if (location.startsWith("angular-cli:")) {
                    try {
                        return new AngularCliResource(location.replace("angular-cli", "http") );
                    } catch (MalformedURLException e) {
                        throw new RuntimeException(e);
                    }
                }
                return null;
            }
        });
        registry.addResourceHandler("/**").addResourceLocations("angular-cli://" + clientHost );
    }

    static class AngularCliResource extends UrlResource {
        public AngularCliResource(URI uri) throws MalformedURLException {
            super(uri);
        }

        public AngularCliResource(URL url) {
            super(url);
        }

        public AngularCliResource(String path) throws MalformedURLException {
            super(path);
        }

        public AngularCliResource(String protocol, String location) throws MalformedURLException {
            super(protocol, location);
        }

        public AngularCliResource(String protocol, String location, String fragment) throws MalformedURLException {
            super(protocol, location, fragment);
        }

        @Override
        public boolean exists() {
            return true;
        }

        @Override
        public long contentLength() throws IOException {
            try (InputStream is = getInputStream()) {
                return StreamUtils.drain(is);
            }
        }
        
        @Override
        public InputStream getInputStream() throws IOException {
            try {
                return super.getInputStream();
            } catch (IOException e) {
                String message = String.format("<h1>Resource not found. Is angular-cli " +
                        "running?</h1><a href=\"%s\">%s</a>", getURL(), getURL() );
                return new ByteArrayInputStream(message.getBytes());
            }
        }

        @Override
        public Resource createRelative(String relativePath) throws MalformedURLException {
            try {
                return new AngularCliResource(super.createRelative(relativePath).getURL());
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException(e);
            }
        }
    }
}