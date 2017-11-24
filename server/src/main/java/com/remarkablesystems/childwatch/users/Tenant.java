package com.remarkablesystems.childwatch.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="tenant")
public class Tenant {

	@Id
	String id;
	
	@Column(name="name")
	String name;
	
	@Column(name="active")
	boolean active;


	public Tenant() {}
	
	public Tenant( String id, String name ) {
		this.id = id;
		this.name = name;
		this.active = true;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getId() {
		return id;
	}
	
}
