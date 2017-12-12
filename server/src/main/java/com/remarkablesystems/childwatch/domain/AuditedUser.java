package com.remarkablesystems.childwatch.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.remarkablesystems.childwatch.config.multitenant.TenantContext;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@MappedSuperclass
@ToString(exclude="logger")
@EqualsAndHashCode()
public abstract class AuditedUser {
	
	@Transient
	Logger logger = LoggerFactory.getLogger("AUDITOR");

	@Column(name="updated_by_user_id")	
	@Getter
	String updatedByUser;
	
	@Column(name="updated_date")
	@Temporal(TemporalType.TIMESTAMP)
	@Getter
	Date updatedDate;
			
	@PrePersist
	private void prePersist() {
		this.updatedByUser = TenantContext.getCurrentUser();
		this.updatedDate = new Date();
	}

	@PreUpdate
	private void preUpdate() {
		this.updatedByUser = TenantContext.getCurrentUser();
		this.updatedDate = new Date();		
	}
	
	@PostPersist
	private void postPersist() {
		logger.info("persisted: " + this.toString() );
	}
	
	@PostUpdate
	private void postUpdate() {
		logger.info("updated: " + this.toString() );
	}
	
	
}
