package com.remarkablesystems.childwatch.users;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(collectionResourceRel = "users", path = "user")
public interface UserRepository extends CrudRepository<User, String> {
	
	User findByUsernameAndPassword( String username, String password );
}
