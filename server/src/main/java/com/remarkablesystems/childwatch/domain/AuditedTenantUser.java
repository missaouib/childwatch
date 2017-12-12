package com.remarkablesystems.childwatch.domain;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.remarkablesystems.childwatch.config.multitenant.TenantContext;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@MappedSuperclass
@ToString()
@EqualsAndHashCode(callSuper=true)
public abstract class AuditedTenantUser extends AuditedUser {

	@Column(name="updated_by_tenant_id")	
	@Getter
	String updatedByTenant;	
	
	@PrePersist
	private void prePersist() {
		this.updatedByTenant = TenantContext.getCurrentTenant();
	}
	
	@PreUpdate
	private void preUpdate() {
		this.updatedByTenant = TenantContext.getCurrentTenant();		
	}
	
	
}
