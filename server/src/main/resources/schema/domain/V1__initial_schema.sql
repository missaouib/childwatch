   create table family (
        family_id varchar(255) not null,
        name varchar(255),
        primary key (family_id)
    );

    create table non_participant (
        non_participant_id varchar(255) not null,
        first_name varchar(255),
        last_name varchar(255),
        primary key (non_participant_id)
    );

    create table non_participant_relationship (
        id  serial not null,
        dropoff_authorization boolean not null,
        notes varchar(255),
        parent boolean not null,
        payment_responsibility boolean not null,
        pickup_authorization varchar(255),
        non_participant_id varchar(255),
        participant_id varchar(255),
        primary key (id)
    );

    create table participant (
        participant_id varchar(255) not null,
        date_of_birth date,
        first_name varchar(255),
        img_url varchar(255),
        last_name varchar(255),
        primary key (participant_id)
    );

    create table participant_family (
        participant_id varchar(255) not null,
        family_id varchar(255) not null,
        primary key (participant_id, family_id)
    );

    create table participant_presence_log (
        id  serial not null,
        event_time timestamptz,
        type varchar(255),
        participant_id varchar(255),
        room_id varchar(255),
        primary key (id)
    );

    create table participant_room_assignment (
        id  serial not null,
        date date,
        participant_id varchar(255),
        primary key (id)
    );

    create table participant_room_assignment_entries (
        participant_room_assignment_id int4 not null,
        end_time timestamptz,
        room_id varchar(255),
        start_time timestamptz
    );

    create table person_schedule (
        person_id varchar(255) not null,
        effective_date date,
        schedule bytea,
        primary key (person_id)
    );

    create table room (
        room_id varchar(255) not null,
        max_capacity int4 not null,
        name varchar(255),
        staff_capacity int4 not null,
        target_capacity int4 not null,
        primary key (room_id)
    );

    create table staff (
        staff_id varchar(255) not null,
        first_name varchar(255),
        last_name varchar(255),
        primary key (staff_id)
    );

    create table staff_presence_log (
        id  serial not null,
        event_time timestamptz,
        type varchar(255),
        room_id varchar(255),
        staff_id varchar(255),
        primary key (id)
    );

    create table staff_room_assignment (
        id  serial not null,
        date date,
        staff_id varchar(255),
        primary key (id)
    );

    create table staff_room_assignment_entries (
        staff_room_assignment_id int4 not null,
        end_time timestamptz,
        room_id varchar(255),
        start_time timestamptz
    );
    
-- Meal items
    
    create table food_component(
    	id varchar(36) NOT NULL,
    	description varchar(128),
    	parent_component varchar(36)
    );
    
    create table food_item(
    	id varchar(36) NOT NULL,
    	description varchar(256) NOT NULL,
    	short_description varchar(128),
    	food_component_id varchar(36) NOT NULL,
    	serving_unit varchar(36) DEFAULT 'each',
    	purchase_unit varchar(36) DEFAULT 'each',
    	notes varchar(4096)
    );
    
    create table meal(
    	id varchar(36) not null,
    	description varchar(128) not null,
    	meal_type varchar(36) not null CHECK ( meal_type IN ( 'BREAKFAST', 'AM_SNACK', 'LUNCH', 'PM_SNACK', 'DINNER', 'LATE_SNACK', 'OTHER' ) )
    );
    
    create table meal_food_item(
    	id serial 		not null,
    	meal_id 		varchar(36) not null,
    	food_item_id 	varchar(36) not null,
    	age_group    	varchar(36) CHECK ( age_group IN ( 'AGE_0_5MO', 'AGE_6_11MO', 'AGE_1_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT') ),
   	 	quantity        numeric (4, 2) DEFAULT 1,
   		unit        	varchar(36) DEFAULT 'each'
    );
    
	create table meal_event(
		id varchar( 36 ) NOT NULL,
		meal_id varchar(36),
   		start_date        DATE NOT NULL,
   		end_date          DATE DEFAULT DATE '12/31/3000',
   		recurrence_id     varchar (36)
	);
	
	CREATE TABLE unit_of_measure(
   		unit          varchar(36) NOT NULL,
   		unit_type	  varchar(36)
	);
	
	-- to = (( from + from_offset ) * muliplicand / denominator ) + to_offset	
	CREATE TABLE unit_conversion(
		from_unit  varchar(36) NOT NULL,
		to_unit	  varchar(36) NOT NULL,
		from_offset	  numeric (4,2) NOT NULL DEFAULT 0,
		multiplicand  numeric (4,2) NOT NULL DEFAULT 1,
		denominator   numeric (4,2) NOT NULL DEFAULT 1,
		to_offset	  numeric (4,2) NOT NULL DEFAULT 0
	);
        

