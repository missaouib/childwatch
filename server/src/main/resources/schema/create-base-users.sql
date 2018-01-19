INSERT INTO common.cw_tenant (id, name) VALUES ('abc', 'ABC Daycare, LLC.');

INSERT INTO common.cw_user (id, username, password, fullname, avatar, tenant_id) VALUES ('abc', 'abc', 'abc', 'ABC User', 'boy.svg', 'abc');
INSERT INTO common.cw_user (id, username, password, fullname, avatar, tenant_id) VALUES ('abc-2', 'user1', 'user1', 'User 1', 'girl.svg', 'abc');
INSERT INTO common.cw_user (id, username, password, fullname, avatar, tenant_id) VALUES ('childwatch', 'childwatch-abc', 'childWatch!@', 'ABC Admin-CW', 'boy-2.svg', 'abc');

INSERT INTO common.cw_authorization (authority, description) VALUES ('ADMIN-CW', 'Childwatch Administrator');
INSERT INTO common.cw_authorization (authority, description) VALUES ('ADMIN', 'Tenant Administrator');

INSERT INTO common.cw_authority (user_id, authority) VALUES ('abc','ADMIN');
INSERT INTO common.cw_authority (user_id, authority) VALUES ('childwatch', 'ADMIN');
INSERT INTO common.cw_authority (user_id, authority) VALUES ('childwatch', 'ADMIN-CW');
