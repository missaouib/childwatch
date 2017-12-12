INSERT INTO common.tenant (id, name, active) VALUES ( 'abc', 'ABC Daycare, LLC.', true );
INSERT INTO common.tenant (id, name, active) VALUES ( 'xyz', 'XYZ Kidz', true );


INSERT INTO common.cw_user (id, username, password, fullname, avatar, active, tenant_id)
	VALUES ('xyz','xyz','xyz','XYZ User','girl.svg',true, 'xyz' );
INSERT INTO common.cw_user (id, username, password, fullname, avatar, active, tenant_id)
	VALUES ('abc','abc','abc','ABC User','boy.svg',true, 'abc' );
