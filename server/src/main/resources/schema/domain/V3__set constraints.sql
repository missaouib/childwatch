alter table domain.food_item 
add primary key (id);
    
alter table domain.meal 
add primary key (id);
    
alter table domain.meal_food_item 
add primary key (id);
    
alter table domain.meal_event 
add PRIMARY KEY (id);

    
alter table domain.meal_food_item
add constraint FK_food_item__id
	foreign key (food_item_id)
    references food_item;

alter table domain.meal_food_item
add constraint FK_meal__id
    foreign key (meal_id)
    references meal;
        
alter table domain.meal_event
add constraint FK_meal_event_id
    foreign key (meal_id)
    references meal;        

alter table domain.food_item_tag
add constraint FK_food_item_id
    foreign key (food_item_id)
    references food_item;
    
alter table domain.food_item
add constraint FK_food_item_parent_id
	foreign key (parent_id)
	references food_item;