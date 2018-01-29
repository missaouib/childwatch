create schema if not exists common authorization "cw-db";

drop table if exists common.person cascade;
drop table if exists common.participant cascade;
drop table if exists common.relationship cascade;


set search_path TO common;

create table if not exists common.person(
    	id 					varchar(36) NOT NULL,
    	given_name 			varchar(64),
    	additional_name 	varchar(64),
		nick_name			varchar(64),
    	family_name 		varchar(64),
    	suffix				varchar(64),
    	inactive			boolean NOT NULL DEFAULT false,
    	person_type			varchar(36) NOT NULL DEFAULT 'PERSON',
    	tenant_id			varchar(36),
    	updated_by_user_id	varchar(36),
    	updated_date  		TIMESTAMP WITH TIME ZONE,
    	
    	primary key (id),
    	constraint chk_person_type_valid check ( person_type IN ('PARTICIPANT', 'PERSON', 'EMPLOYEE', 'OTHER' ) ),
    	constraint fk_person_user foreign key (updated_by_user_id) references common.cw_user,
    	constraint fk_person_tenant foreign key (tenant_id) references common.cw_tenant    	
    );
    
create or replace function is_person_type(varchar(36), varchar(36)) returns boolean as $$
select exists (
    select 1
    from common.person
    where id   = $1
      and person_type = $2
);
$$ language sql;    
    
create table if not exists common.participant(
    	id 					varchar(36) NOT NULL,
    	dob					DATE,
    	updated_by_user_id	varchar(36),
    	updated_date  		TIMESTAMP WITH TIME ZONE,
    	
    	primary key (id),
    	constraint chk_is_participant check (is_person_type(id,'PARTICIPANT')),
    	constraint fk_participant_id foreign key (id) references common.person,
    	constraint fk_participant_user foreign key (updated_by_user_id) references common.cw_user  	
    );    

create table if not exists common.relationship(
    	participant_id		varchar(36) NOT NULL,
    	to_id				varchar(36) NOT NULL,
		relationship		varchar(36) NOT NULL DEFAULT 'FAMILY',
		authorized_pickup	boolean NOT NULL DEFAULT false,
		notes				varchar(4096),
    	updated_by_user_id	varchar(36),
    	updated_date  		TIMESTAMP WITH TIME ZONE,
    	
    	unique (participant_id, to_id, relationship),
		constraint chk_is_relationship check( relationship in ( 'FAMILY', 'OTHER') ),
    	constraint fk_participant_participant_id foreign key (participant_id) references common.person,
    	constraint chk_is_participant check (is_person_type(participant_id,'PARTICIPANT')),
	    constraint fk_participant_to_id foreign key (to_id) references common.person,
    	constraint fk_participant_user foreign key (updated_by_user_id) references common.cw_user  	
    );    

alter table common.person owner to "cw-db";
alter table common.participant owner to "cw-db";
alter table common.relationship owner to "cw-db";

set search_path TO abc;

create or replace view person as SELECT * FROM common.person WHERE tenant_id = 'abc' WITH CASCADED CHECK OPTION;    
create or replace view participant as SELECT * FROM common.participant WHERE id IN (SELECT id from person) WITH CASCADED CHECK OPTION;    
create or replace view relationship as SELECT * FROM common.relationship WHERE participant_id IN (SELECT id from person) WITH CASCADED CHECK OPTION;    


alter view person owner to "cw-db";
alter view participant owner to "cw-db";


