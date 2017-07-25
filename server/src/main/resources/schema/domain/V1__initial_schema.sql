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
    
    create table food_component(
    	id varchar(255) not null,
    	description varchar(1024),
    	primary key (id)
    );
    
    create table food_item(
    	id varchar(255) not null,
    	description varchar(1024) not null,
    	short_description varchar(128),
    	food_component_id varchar(255),
    	primary key (id)
    );
    
    create table meal(
    	id varchar(255) not null,
    	description varchar(128) not null,
    	type varchar(30) not null,
    	primary key (id)
    );
    
    create table meal_food_item(
    	id serial not null,
    	meal_id varchar(255) not null,
    	food_item_id varchar(255) not null,
    	primary key (id)
    );
    
    CREATE TABLE meal_schedule(
   		id                VARCHAR (36) NOT NULL,
   		start_date        DATE NOT NULL,
   		end_date          DATE,
   		repeat_interval   INTERVAL (0),
   		meal_id           varchar (255),
   		PRIMARY KEY (id)
	);

ALTER TABLE meal_schedule
   ADD CONSTRAINT FK_meal_schedule_1 
   FOREIGN KEY (meal_id) REFERENCES meal (id);
    
    alter table food_item
        add constraint FK_food_component__id
        foreign key (food_component_id)
        references food_component;

    alter table meal_food_item
        add constraint FK_food_item__id
        foreign key (food_item_id)
        references food_item;

    alter table meal_food_item
        add constraint FK_meal__id
        foreign key (meal_id)
        references meal;
        
        
    create index IDXtqkge09h0790muhxmrfyi083y on participant_room_assignment (participant_id, date);

    alter table person_schedule
        add constraint UKhxj3u8mq9v6usqlc2hnmrbkot unique (person_id, effective_date);

    create index IDX1n2flhy2k6d294fmtx5907xay on staff_room_assignment (staff_id, date);

    alter table non_participant_relationship
        add constraint FKb3mnxwgs4b77gjf21isc4acne
        foreign key (non_participant_id)
        references non_participant;

    alter table non_participant_relationship
        add constraint FK40sflxodqda2fbxe5fem6i1u3
        foreign key (participant_id)
        references participant;

    alter table participant_family
        add constraint FKbcnth48xqh26argctxiah8h23
        foreign key (family_id)
        references family;

    alter table participant_family
        add constraint FKkc3adyw8v353isk7v51wxv9gx
        foreign key (participant_id)
        references participant;

    alter table participant_presence_log
        add constraint FKkgh8vst5juo35gv8qjwnvaw0y
        foreign key (participant_id)
        references participant;

    alter table participant_presence_log
        add constraint FKr7u948vjy12t6wspscwengooy
        foreign key (room_id)
        references room;

    alter table participant_room_assignment
        add constraint FK78ih5d9fmmewmpu3p250cx6g7
        foreign key (participant_id)
        references participant;

    alter table participant_room_assignment_entries
        add constraint FKkeha6mnxn3wj23kclc15kk2fk
        foreign key (room_id)
        references room;

    alter table participant_room_assignment_entries
        add constraint FKssg0s5qbyxploeadeo31wfl84
        foreign key (participant_room_assignment_id)
        references participant_room_assignment;

    alter table staff_presence_log
        add constraint FK4hgu7wwfn57thd3nho4vrt3x8
        foreign key (room_id)
        references room;

    alter table staff_presence_log
        add constraint FKlbfd2qy17qkx0slhfp4x0c991
        foreign key (staff_id)
        references staff;

    alter table staff_room_assignment
        add constraint FKc390uo4pjlnfwpbuu44uipmlv
        foreign key (staff_id)
        references staff;

    alter table staff_room_assignment_entries
        add constraint FKs585mew1y643beq98j48sc990
        foreign key (room_id)
        references room;

    alter table staff_room_assignment_entries
        add constraint FKinlpvmulnnoxlebj3nak90nef
        foreign key (staff_room_assignment_id)
        references staff_room_assignment;
