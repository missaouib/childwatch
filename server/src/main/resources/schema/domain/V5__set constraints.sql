	    alter table domain.food_component add primary key (id);
    
    alter table domain.food_item add primary key (id);
    
    alter table domain.meal add primary key (id);
    
    alter table domain.meal_food_item add primary key (id);
    
    alter table domain.meal_event add PRIMARY KEY (id);
	
	alter table domain.unit_of_measure add primary key(unit);
		
    
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
        
    alter table domain.meal_event
    add constraint FK_meal_event_id
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