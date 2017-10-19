        
    -- units IN ('OUNCES', 'LBS', 'GALLONS', 'CUPS', 'TABLESPOONS' )

    
    create table food_item(
    	id 					varchar(36) NOT NULL,
    	description 		varchar(256) NOT NULL,
    	short_description 	varchar(128),
    	serving_unit 		varchar(36) DEFAULT 'EACH' CHECK( serving_unit IN ('OUNCES', 'LBS', 'GALLONS', 'CUPS', 'TABLESPOONS' ) ),
    	purchase_unit 		varchar(36) DEFAULT 'EACH' CHECK( purchase_unit IN ('OUNCES', 'LBS', 'GALLONS', 'CUPS', 'TABLESPOONS' ) ),
    	notes 				varchar(4096)
    );
    
    create table meal(
    	id 				varchar(36) not null,
    	description 	varchar(128) not null,
    	meal_type 		varchar(36) not null CHECK ( meal_type IN ( 'BREAKFAST', 'AM_SNACK', 'LUNCH', 'PM_SNACK', 'DINNER' ) ),
    	notes			varchar(4096)
    );
    
    create table meal_food_item(
    	id 				varchar(36) not null,
    	meal_id 		varchar(36),
    	food_item_id 	varchar(36),
    	age_group    	varchar(36) CHECK ( age_group IN ( 'AGE_0_5MO', 'AGE_6_11MO', 'AGE_1_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT') ),
   	 	quantity        numeric (4, 2) DEFAULT 1,
   		unit        	varchar(36)
    );
    
	create table meal_event(
		id 				varchar( 36 ) NOT NULL,
		meal_id 		varchar(36),
   		start_date      TIMESTAMP WITH TIME ZONE NOT NULL,
   		end_date        TIMESTAMP WITH TIME ZONE  NOT NULL DEFAULT DATE '12/31/3000',
   		recurrence  	varchar (36) DEFAULT 'NONE' CHECK (recurrence IN ('NONE', 'DAILY', 'WEEKLY', 'BIWEEKLY' ) )
	);
	
	create table food_item_tag(
		food_item_id	varchar( 36 ) NOT NULL,
		tag_value       	varchar(128) NOT NULL
	);
		
	-- to = (( from + from_offset ) * muliplicand / denominator ) + to_offset	
	CREATE TABLE conversion(
		id	varchar(36) NOT NULL,
		from_unit  varchar(36) NOT NULL CHECK( from_unit IN ('OUNCES', 'LBS', 'GALLONS', 'CUPS', 'TABLESPOONS' ) ),
		to_unit	  varchar(36) NOT NULL CHECK( to_unit IN ('OUNCES', 'LBS', 'GALLONS', 'CUPS', 'TABLESPOONS' ) ),
		from_offset	  numeric (4,2) NOT NULL DEFAULT 0,
		multiplicand  numeric (4,2) NOT NULL DEFAULT 1,
		denominator   numeric (4,2) NOT NULL DEFAULT 1,
		to_offset	  numeric (4,2) NOT NULL DEFAULT 0
	);
		
	
        

