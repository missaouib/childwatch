INSERT INTO users.users (username, password, enabled) VALUES ( 'admin', '$2a$10$KFSHBHXTb8Y8lUZKxTCJb.GtY99FIHsjADXrTUAwhvxVoVDMERbfu', TRUE);
INSERT INTO users.users (username, password, enabled) VALUES ( 'jimmy', '$2a$10$piCOVhSEn5FL6vSx4lrtz.EpXCIc5tvRR9/ONt3L.F9kqDWwM37py', TRUE);
INSERT INTO users.users (username, password, enabled) VALUES ( 'jackie', '$2a$10$WeZ2G6D3ZZ4I3GZWdCWU5.bIGbFg/v.zUdMYU0tBK7joyS30ks7RG', TRUE);
COMMIT;

INSERT INTO users.authorities (username, authority) VALUES ('admin', 'ADMIN');
INSERT INTO users.authorities (username, authority) VALUES ('admin', 'SCHEDULE_MANAGE');
INSERT INTO users.authorities (username, authority) VALUES ('admin', 'SCHEDULE_VIEW');
INSERT INTO users.authorities (username, authority) VALUES ('jimmy', 'SCHEDULE_MANAGE');
INSERT INTO users.authorities (username, authority) VALUES ('jimmy', 'SCHEDULE_VIEW');
INSERT INTO users.authorities (username, authority) VALUES ('jackie', 'SCHEDULE_VIEW');
COMMIT;

