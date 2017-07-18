CREATE TABLE users (
  username VARCHAR PRIMARY KEY,
  password VARCHAR NOT NULL,
  enabled BOOLEAN NOT NULL
);

CREATE TABLE authorities (
  username VARCHAR REFERENCES users,
  authority VARCHAR NOT NULL
);

CREATE INDEX authorities_by_username ON authorities(username);
