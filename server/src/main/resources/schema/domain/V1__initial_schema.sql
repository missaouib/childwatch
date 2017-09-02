    
-- Meal items
    
    create table food_component(
    	id 					varchar(36) NOT NULL,
    	description 		varchar(128),
    	parent_component 	varchar(36)
    );
    
    create table food_item(
    	id 					varchar(36) NOT NULL,
    	description 		varchar(256) NOT NULL,
    	short_description 	varchar(128),
    	food_component_id 	varchar(36) NOT NULL,
    	serving_unit 		varchar(36) DEFAULT 'each',
    	purchase_unit 		varchar(36) DEFAULT 'each',
    	notes 				varchar(4096)
    );
    
    create table meal(
    	id 				varchar(36) not null,
    	description 	varchar(128) not null,
    	meal_type 		varchar(36) not null CHECK ( meal_type IN ( 'BREAKFAST', 'AM_SNACK', 'LUNCH', 'PM_SNACK', 'DINNER', 'LATE_SNACK', 'OTHER' ) )
    );
    
    create table meal_food_item(
    	id 				varchar(36) not null,
    	meal_id 		varchar(36),
    	food_item_id 	varchar(36),
    	age_group    	varchar(36) CHECK ( age_group IN ( 'AGE_0_5MO', 'AGE_6_11MO', 'AGE_1_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT') ),
   	 	quantity        numeric (4, 2) DEFAULT 1,
   		unit        	varchar(36) DEFAULT 'each'
    );
    
	create table meal_event(
		id 				varchar( 36 ) NOT NULL,
		meal_id 		varchar(36),
   		start_date      DATE NOT NULL,
   		end_date        DATE DEFAULT DATE '12/31/3000',
   		recurrence_id   varchar (36)
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
        

