/* MEALS */             
INSERT INTO domain.meal (id, description, type) VALUES ('19f18510-42aa-439e-9c5d-35c3b4169f0b', 'Breakfast #1', 'BREAKFAST');
INSERT INTO domain.meal (id, description, type) VALUES ('e59a5bc4-a6fc-4c76-a187-7079954c5489', 'Snack #1', 'AM_SNACK');
INSERT INTO domain.meal (id, description, type) VALUES ( 'b6d8eda4-7252-4ba7-ad81-a0ff0e7a2da3', 'Standard Lunch', 'LUNCH');
INSERT INTO domain.meal (id, description, type) VALUES ( 'bc63d3ec-53ca-40e1-af4f-13340b0a071d', 'Standard Snack (PM)', 'PM_SNACK');
INSERT INTO domain.meal (id, description, type) VALUES ('030004fc-d0be-40fb-833e-eef5976a05ec', 'Dinner #1', 'DINNER');

COMMIT;

INSERT INTO domain.meal_food_item (id, meal_id, food_item_id, age_group, amount, uom_id)
     VALUES (1, '19f18510-42aa-439e-9c5d-35c3b4169f0b', '3939ef23-236b-4175-98c7-e4a8bc9e847b', NULL, 1.00, NULL);
     
COMMIT;