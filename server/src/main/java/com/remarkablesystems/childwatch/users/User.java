package com.remarkablesystems.childwatch.users;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.remarkablesystems.childwatch.domain.food.FoodItemTag;


@Entity
@Table(name="cw_user")
public class User {
	
	@Id 
	@Column(name="id")
	String id;
	
	@Column(name="username")
	String username;
	
	@Column(name="fullname")
	String fullName;	
	
	@Column(name="avatar")
	String avatar;
	
	@Column(name="password")
	String password;
	
	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	@ElementCollection( fetch=FetchType.EAGER )
	@CollectionTable( name="user_authority", joinColumns=@JoinColumn( name="user_id", nullable=false ) )
	@Column( name="authority", nullable=false )
	Set<String> authorities = new HashSet<String>();
	
	@ManyToOne
	@JoinColumn(name="tenant_id")
	Tenant tenant;
	
	public Tenant getTenant() {
		return tenant;
	}
	
	public void setTenant( Tenant tenant ) {
		this.tenant = tenant;
	}


	public User() {}
	
	
	public String getUsername() {
		return username;
	}




	public void setUsername(String username) {
		this.username = username;
	}




	public String getFullName() {
		return fullName;
	}




	public void setFullName(String fullName) {
		this.fullName = fullName;
	}




	public String getAvatar() {
		return avatar;
	}




	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}




	public String getId() {
		return id;
	}




	public Set<String> getAuthorities() {
		return authorities;
	}
	
	public void addAuthority( String authority ) {
		this.authorities.add(authority);
	}

	public boolean hasAuthority( String authority ) {
		return this.authorities.contains(authority);
	}
	
	public void revokeAuthority( String authority ) {
		this.authorities.remove(authority);
	}


	@Transient
	boolean isAdmin() {
		return authorities.contains("ADMIN");
	}
	

}
