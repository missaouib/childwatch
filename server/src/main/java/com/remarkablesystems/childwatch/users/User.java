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

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Entity
@Table(name="cw_user")
@ToString()
@EqualsAndHashCode()
public class User {
	
	@Id 
	@Column(name="id")
	@Getter
	String id;
	
	@Column(name="username")
	@Getter @Setter
	String username;
	
	@Column(name="fullname")
	@Getter @Setter
	String fullName;	
	
	@Column(name="avatar")
	@Getter @Setter
	String avatar;
	
	@Column(name="password")
	@Getter @Setter
	String password;

	
	@Column(name="weekendsShowing")
	@Getter @Setter
	boolean weekendsShowing;

	@ElementCollection( fetch=FetchType.EAGER )
	@CollectionTable( name="cw_authority", joinColumns=@JoinColumn( name="user_id", nullable=false ) )
	@Column( name="authority", nullable=false )
	@Getter
	Set<String> authorities = new HashSet<String>();
	
	@Column(name="dark")
	@Getter @Setter
	boolean dark;
	
	@Column(name="primary_color")
	@Getter @Setter
	String primary;
	
	@Column(name="secondary_color")
	@Getter @Setter
	String secondary;
	
	@Column(name="theme")
	@Getter @Setter
	String theme;

	
	@ManyToOne
	@JoinColumn(name="tenant_id")
	@Getter @Setter
	Tenant tenant;
	

	public User() {}

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
