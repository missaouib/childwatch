
    create table food_item(
    	id 					varchar(36) NOT NULL,
    	description 		varchar(256) NOT NULL,
    	short_description 	varchar(128),
    	serving_unit 		varchar(36) NOT NULL DEFAULT 'OUNCES' CHECK( serving_unit IN ('OUNCES', 'LBS', 'GALLONS', 'CUPS', 'TABLESPOONS', 'UNITS', 'SERVINGS' ) ),
    	purchase_unit 		varchar(36) DEFAULT 'OUNCES' CHECK( purchase_unit IN ('OUNCES', 'LBS', 'GALLONS', 'CUPS', 'TABLESPOONS', 'UNITS', 'SERVINGS' ) ),
    	serving_quantity	numeric DEFAULT 1,
    	serving_type		varchar(128),
    	portion_size		numeric DEFAULT 1,
    	parent_id			varchar(36),
    	notes 				varchar(4096)
    );
    
    create table meal(
    	id 				varchar(36) NOT NULL,
    	description 	varchar(128) NOT NULL,
    	meal_type 		varchar(36) NOT NULL CHECK ( meal_type IN ( 'BREAKFAST', 'AM_SNACK', 'LUNCH', 'PM_SNACK', 'DINNER' ) ),
    	notes			varchar(4096)
    );
    
    create table meal_food_item(
    	id 				varchar(36) not null,
    	meal_id 		varchar(36),
    	food_item_id 	varchar(36),
    	age_group    	varchar(36) CHECK ( age_group IN ( 'AGE_0_5MO', 'AGE_6_11MO', 'AGE_1YR', 'AGE_2YR', 'AGE_3_5YR', 'AGE_6_12YR', 'AGE_13_18YR', 'AGE_ADULT') ),
   	 	quantity        numeric DEFAULT 1,
   		unit        	varchar(36) DEFAULT 'SERVINGS' CHECK( unit IN ('OUNCES', 'LBS', 'GALLONS', 'CUPS', 'TABLESPOONS', 'UNITS', 'SERVINGS' ) )
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
		tag_value       varchar(128) NOT NULL
	);
				
	
        

