INSERT INTO common.cw_tenant (id, name, active) VALUES ( 'abc', 'ABC Daycare, LLC.', true );
INSERT INTO common.cw_tenant (id, name, active) VALUES ( 'xyz', 'XYZ Kidz', true );


INSERT INTO common.cw_user (id, username, password, fullname, avatar, active, tenant_id, weekendsShowing)
	VALUES ('xyz','xyz','xyz','XYZ User','girl.svg',true, 'xyz', true );
INSERT INTO common.cw_user (id, username, password, fullname, avatar, active, tenant_id, weekendsShowing)
	VALUES ('abc','abc','abc','ABC User','boy.svg',true, 'abc', false );
    
INSERT INTO common.cw_authority (user_id, authority)
	VALUES ('abc','ADMIN');

INSERT INTO common.cw_authority (user_id, authority)
	VALUES ('xyz','ADMIN');


