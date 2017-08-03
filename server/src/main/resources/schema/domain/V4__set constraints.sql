    alter table domain.food_component add primary key (id);
    
    alter table domain.food_item add primary key (id);
    
    alter table domain.meal add primary key (id);
    
    alter table domain.meal_food_item add primary key (id);
    
    alter table domain.meal_schedule add PRIMARY KEY (id);
	
	alter table domain.unit_of_measure add primary key(id);
	
	alter table domain.age_group add primary key (id);
	


	alter table domain.meal_food_item
		add constraint FK_age_group_1
		foreign key (age_group) REFERENCES age_group(id);
	
alter table domain.meal_food_item
	add constraint FK_unit_of_measure_1
	foreign key (uom_id) REFERENCES unit_of_measure (id);

alter table domain.meal_schedule
   ADD CONSTRAINT FK_meal_schedule_1 
   FOREIGN KEY (meal_id) REFERENCES meal (id);
    
    alter table domain.food_item
        add constraint FK_food_component__id
        foreign key (food_component_id)
        references food_component;

    alter table domain.meal_food_item
        add constraint FK_food_item__id
        foreign key (food_item_id)
        references food_item;

    alter table domain.meal_food_item
        add constraint FK_meal__id
        foreign key (meal_id)
        references meal;