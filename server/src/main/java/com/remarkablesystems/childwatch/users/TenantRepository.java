package com.remarkablesystems.childwatch.users;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(collectionResourceRel = "tenants", path = "tenant")
public interface TenantRepository extends CrudRepository<Tenant, String> {
}
