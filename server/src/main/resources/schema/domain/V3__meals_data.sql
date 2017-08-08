/* MEALS */             
INSERT INTO domain.meal (id, description, meal_type) VALUES ('19f18510-42aa-439e-9c5d-35c3b4169f0b', 'Breakfast #1', 'BREAKFAST');
INSERT INTO domain.meal (id, description, meal_type) VALUES ('e59a5bc4-a6fc-4c76-a187-7079954c5489', 'Snack #1', 'AM_SNACK');
INSERT INTO domain.meal (id, description, meal_type) VALUES ( 'b6d8eda4-7252-4ba7-ad81-a0ff0e7a2da3', 'Standard Lunch', 'LUNCH');
INSERT INTO domain.meal (id, description, meal_type) VALUES ( 'bc63d3ec-53ca-40e1-af4f-13340b0a071d', 'Standard Snack (PM)', 'PM_SNACK');
INSERT INTO domain.meal (id, description, meal_type) VALUES ('030004fc-d0be-40fb-833e-eef5976a05ec', 'Dinner #1', 'DINNER');

COMMIT;

INSERT INTO domain.meal_food_item (id, meal_id, food_item_id ) VALUES (1, '19f18510-42aa-439e-9c5d-35c3b4169f0b', '3939ef23-236b-4175-98c7-e4a8bc9e847b' );
INSERT INTO domain.meal_food_item (id, meal_id, food_item_id ) VALUES (2, '19f18510-42aa-439e-9c5d-35c3b4169f0b', '1822a47b-2254-444c-ba28-525f38f76b7b' );
INSERT INTO domain.meal_food_item (id, meal_id, food_item_id ) VALUES (3, 'e59a5bc4-a6fc-4c76-a187-7079954c5489', '0efb57ab-5fce-4bb4-bd1b-9226da43ca4a');

INSERT INTO domain.menu(id, start_date, meal_id) VALUES ('b26a129c-aa6f-4fb9-b526-c490b8f64a03', TO_DATE ('08/07/2017', 'MM/DD/YYYY'), 'e59a5bc4-a6fc-4c76-a187-7079954c5489');
INSERT INTO domain.menu (id, start_date, meal_id) VALUES ('95c768fe-9086-4a38-b90d-6bb13c834743', TO_DATE ('08/07/2017', 'MM/DD/YYYY'), '19f18510-42aa-439e-9c5d-35c3b4169f0b');
INSERT INTO domain.menu(id, start_date, meal_id) VALUES ('29714c16-efa6-4e7f-8314-d58e305475ee', TO_DATE ('08/08/2017', 'MM/DD/YYYY'), 'e59a5bc4-a6fc-4c76-a187-7079954c5489');
INSERT INTO domain.menu(id, start_date, meal_id) VALUES ('74c390c1-93b5-4a20-ad91-344e4c3ad8c1', TO_DATE ('08/09/2017', 'MM/DD/YYYY'), 'e59a5bc4-a6fc-4c76-a187-7079954c5489');
INSERT INTO domain.menu(id, start_date, meal_id) VALUES ('9f5e4e9e-1572-4d68-9d74-7c3852e242cf', TO_DATE ('08/10/2017', 'MM/DD/YYYY'), 'e59a5bc4-a6fc-4c76-a187-7079954c5489');
INSERT INTO domain.menu(id, start_date, meal_id) VALUES ('3804fe48-a07c-4557-9a01-31b3db582582', TO_DATE ('08/11/2017', 'MM/DD/YYYY'), 'e59a5bc4-a6fc-4c76-a187-7079954c5489');

	
COMMIT;

