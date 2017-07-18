package com.remarkablesystems.childwatch.graphql;

import java.util.List;

public class User {
    private final String username;
    private final List<String> authorities;

    public User(String username, List<String> authorities) {
        this.username = username;
        this.authorities = authorities;
    }

    public String getUsername() {
        return username;
    }

    public List<String> getAuthorities() {
        return authorities;
    }
}
