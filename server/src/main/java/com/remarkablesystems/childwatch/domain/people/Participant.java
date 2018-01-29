package com.remarkablesystems.childwatch.domain.people;


import java.util.Date;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.SecondaryTable;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Entity
@SecondaryTable(name="participant")
@DiscriminatorValue("PARTICIPANT")
@NoArgsConstructor 
@AllArgsConstructor( access=AccessLevel.PRIVATE )
public class Participant extends Person {
	
	@Column(table="participant", name="dob")
	@Getter @Setter
	Date dateOfBirth;
	
}
