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

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@Table(name="cw_user")
@Data
@Builder
@AllArgsConstructor @NoArgsConstructor
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
	@Builder.Default String avatar = "boy.svg";
	
	@Column(name="password")
	@Getter @Setter
	@Builder.Default String password = "***===NOLOGIN";
	
	@Column(name="active")
	@Getter @Setter
	@Builder.Default boolean active = true;
	
	@Column(name="weekendsShowing")
	@Getter @Setter
	@Builder.Default boolean weekendsShowing = false;

	@ElementCollection( fetch=FetchType.EAGER )
	@CollectionTable( name="cw_authority", joinColumns=@JoinColumn( name="user_id", nullable=false ) )
	@Column( name="authority", nullable=false )
	@Getter
	@Builder.Default Set<String> authorities = new HashSet<String>();
	
	@Column(name="dark")
	@Getter @Setter
	@Builder.Default boolean dark = false;
	
	@Column(name="primary_color")
	@Getter @Setter
	@Builder.Default String primary = "#F8F5F0";
	
	@Column(name="secondary_color")
	@Getter @Setter
	@Builder.Default String secondary = "#FFB300";
	
	@Column(name="theme")
	@Getter @Setter
	@Builder.Default String theme = "readable";
	
	@ManyToOne
	@JoinColumn(name="tenant_id")
	@Getter @Setter
	Tenant tenant;
	

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
