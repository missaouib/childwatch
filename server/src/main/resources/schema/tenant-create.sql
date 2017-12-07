create schema if not exists demo AUTHORIZATION "cw-db";
set search_path to demo;

    create table if not exists meal(
    	id 				varchar(36) NOT NULL,
    	description 	varchar(128) NOT NULL,
    	meal_type 		varchar(36) NOT NULL CHECK ( meal_type IN ( 'BREAKFAST', 'AM_SNACK', 'LUNCH', 'PM_SNACK', 'SUPPER', 'EV_SNACK' ) ),
    	inactive		BOOLEAN NOT NULL DEFAULT false,
    	notes			varchar(4096)
    );
    
    create table if not exists meal_food_item(
    	id 				varchar(36) not null,
    	meal_id 		varchar(36),
    	food_item_id 	varchar(36),
    	age_group    	varchar(36) CHECK ( age_group IN ( 'AGE_0_5MO', 'AGE_6_11MO', 'AGE_1YR', 'AGE_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT') ),
   	 	quantity        numeric DEFAULT 1,
   		unit        	varchar(36) DEFAULT 'SERVINGS' CHECK( unit IN ('OUNCES', 'LBS', 'GALLONS', 'CUPS', 'TABLESPOONS', 'UNITS', 'SERVINGS' ) )
    );
    
	create table if not exists meal_event(
		id 				varchar( 36 ) NOT NULL,
		meal_id 		varchar(36),
   		start_date      TIMESTAMP WITH TIME ZONE NOT NULL,
   		end_date        TIMESTAMP WITH TIME ZONE  NOT NULL DEFAULT DATE '12/31/3000',
   		recurrence  	varchar (36) DEFAULT 'NONE' CHECK (recurrence IN ('NONE', 'DAILY', 'WEEKLY', 'BIWEEKLY' ) )
	);

create or replace view food_item as SELECT * FROM common.food_item;
create or replace view food_item_tag as SELECT * FROM common.food_item_tag;
commit;

alter table meal owner to "cw-db";
alter table meal_food_item owner to "cw-db";
alter table meal_event owner to "cw-db";
alter table food_item owner to "cw-db";
alter table food_item owner to "cw-db";

alter table meal add primary key (id);
alter table meal_food_item add primary key (id);
alter table meal_event add PRIMARY KEY (id);
alter table meal_food_item add constraint FK_meal__id foreign key (meal_id) references meal;
alter table meal_event add constraint FK_meal_event_id foreign key (meal_id) references meal;        
