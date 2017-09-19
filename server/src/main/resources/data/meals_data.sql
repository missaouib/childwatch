/* MEALS */             
INSERT INTO domain.meal (id, description, meal_type) VALUES ('19f18510-42aa-439e-9c5d-35c3b4169f0b', 'Breakfast #1', 'BREAKFAST');
INSERT INTO domain.meal (id, description, meal_type) VALUES ('9a45c0e2-3758-4440-8f6a-a74bdca7b9e9', 'Breakfast #2', 'BREAKFAST');
INSERT INTO domain.meal (id, description, meal_type) VALUES ('82013574-2ee7-4a00-9cff-80c1ee3ff900', 'Breakfast #3', 'BREAKFAST');
INSERT INTO domain.meal (id, description, meal_type) VALUES ('e59a5bc4-a6fc-4c76-a187-7079954c5489', 'Snack #1', 'AM_SNACK');
INSERT INTO domain.meal (id, description, meal_type) VALUES ( 'b6d8eda4-7252-4ba7-ad81-a0ff0e7a2da3', 'Standard Lunch', 'LUNCH');
INSERT INTO domain.meal (id, description, meal_type) VALUES ( 'bc63d3ec-53ca-40e1-af4f-13340b0a071d', 'Standard Snack (PM)', 'PM_SNACK');
INSERT INTO domain.meal (id, description, meal_type) VALUES ('030004fc-d0be-40fb-833e-eef5976a05ec', 'Dinner #1', 'DINNER');

COMMIT;


INSERT INTO domain.meal_food_item (id, meal_id, food_item_id, age_group, quantity, unit ) VALUES ( 'ca4e2ab9-1824-42dd-acec-cb68ecb700a8', '19f18510-42aa-439e-9c5d-35c3b4169f0b', '655a9d7e-329e-496e-99b0-3576a82d443a', 'AGE_ADULT', 2, 'OZ' );

	
	
INSERT INTO domain.meal_event(id, start_date, meal_id) VALUES ('b26a129c-aa6f-4fb9-b526-c490b8f64a03', TO_DATE ('09/11/2017', 'MM/DD/YYYY'), 'e59a5bc4-a6fc-4c76-a187-7079954c5489');

-- AM SNACK
INSERT INTO domain.meal_event (id, start_date, meal_id) VALUES ('95c768fe-9086-4a38-b90d-6bb13c834743', TO_DATE ('09/11/2017', 'MM/DD/YYYY'), '19f18510-42aa-439e-9c5d-35c3b4169f0b');
INSERT INTO domain.meal_event(id, start_date, meal_id) VALUES ('29714c16-efa6-4e7f-8314-d58e305475ee', TO_DATE ('09/12/2017', 'MM/DD/YYYY'), 'e59a5bc4-a6fc-4c76-a187-7079954c5489');
INSERT INTO domain.meal_event(id, start_date, meal_id) VALUES ('74c390c1-93b5-4a20-ad91-344e4c3ad8c1', TO_DATE ('09/13/2017', 'MM/DD/YYYY'), 'e59a5bc4-a6fc-4c76-a187-7079954c5489');
INSERT INTO domain.meal_event(id, start_date, meal_id) VALUES ('9f5e4e9e-1572-4d68-9d74-7c3852e242cf', TO_DATE ('09/14/2017', 'MM/DD/YYYY'), 'e59a5bc4-a6fc-4c76-a187-7079954c5489');
INSERT INTO domain.meal_event(id, start_date, meal_id) VALUES ('3804fe48-a07c-4557-9a01-31b3db582582', TO_DATE ('09/15/2017', 'MM/DD/YYYY'), 'e59a5bc4-a6fc-4c76-a187-7079954c5489');

-- LUNCH
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('d1bb41d9-55b7-49d0-8afb-33c1f68a94b5', TO_DATE('09/11/2017', 'MM/DD/YYYY'), 'b6d8eda4-7252-4ba7-ad81-a0ff0e7a2da3' );
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('650b1fe6-e6ae-4818-8052-9b05f1997084', TO_DATE('09/12/2017', 'MM/DD/YYYY'), 'b6d8eda4-7252-4ba7-ad81-a0ff0e7a2da3' );
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('8d45f742-1621-4780-845a-635afdca4604', TO_DATE('09/13/2017', 'MM/DD/YYYY'), 'b6d8eda4-7252-4ba7-ad81-a0ff0e7a2da3' );
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('b88b4c03-2614-4ce5-8b7d-995a542af990', TO_DATE('09/14/2017', 'MM/DD/YYYY'), 'b6d8eda4-7252-4ba7-ad81-a0ff0e7a2da3' );
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('8cd635f1-d5d9-41a6-b5c0-c0d3f6c41b45', TO_DATE('09/15/2017', 'MM/DD/YYYY'), 'b6d8eda4-7252-4ba7-ad81-a0ff0e7a2da3' );

-- PM SNACK
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('b5c50d38-50a4-4d87-82d5-417a52ce748d', TO_DATE('09/11/2017', 'MM/DD/YYYY'), 'bc63d3ec-53ca-40e1-af4f-13340b0a071d' );
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('d03dcb98-c091-4e65-87fe-c9eaaf3b0cba', TO_DATE('09/12/2017', 'MM/DD/YYYY'), 'bc63d3ec-53ca-40e1-af4f-13340b0a071d' );
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('a05d55c5-af7d-4da1-9b49-3fa0c1fae63b', TO_DATE('09/13/2017', 'MM/DD/YYYY'), 'bc63d3ec-53ca-40e1-af4f-13340b0a071d' );
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('f4ef0c42-83e7-4ee4-8209-7e2c5aaca492', TO_DATE('09/14/2017', 'MM/DD/YYYY'), 'bc63d3ec-53ca-40e1-af4f-13340b0a071d' );
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('ad613e37-9b5f-4c12-a946-65d758ee18e1', TO_DATE('09/15/2017', 'MM/DD/YYYY'), 'bc63d3ec-53ca-40e1-af4f-13340b0a071d' );
	
-- DINNER 
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('b16d865f-59f9-42e0-a03e-2bdee1b16cf3', TO_DATE('09/11/2017', 'MM/DD/YYYY'), '030004fc-d0be-40fb-833e-eef5976a05ec' );
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('1b6f4e35-7449-4df9-92e9-0c40379c6668', TO_DATE('09/13/2017', 'MM/DD/YYYY'), '030004fc-d0be-40fb-833e-eef5976a05ec' );
INSERT INTO domain.meal_event( id, start_date, meal_id ) VALUES ('a30986f6-708f-47e1-9fb4-89dab4f64354', TO_DATE('09/15/2017', 'MM/DD/YYYY'), '030004fc-d0be-40fb-833e-eef5976a05ec' );


COMMIT;

