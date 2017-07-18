## Running the server

To run:

1. Install Java 8.
2. Install PostgreSQL and create a new database.
3. `cp config/SAMPLE.application.yml config/application.yml`, edit the latter to point at your DB.
4. Run:
    * `dev_server.bat` on Windows
    * `./dev_server.sh` on Linux
5. Go to http://localhost:8080.
6. Login in with user: admin password: secret

## Re-generating demo data

In order to wipe all the data and run the demo data generator, include the "wipe" flag like this:
`./dev_server.sh -Dwipe`

## Development environment

The server has been developed mostly using IntelliJ IDEA Community Edition on Linux. However, it should work
perfectly fine on any other popular environment, and there is nothing IDE-specific anywhere. Windows with VSCode or
Eclipse should work just as well.

## Testing GraphQL endpoint

Try the following mutation:

```
mutation {
  createStaff(firstName: "Jimmy", lastName: "Walker")
}
```

... and then the query:

```
query {
  staff {
    id
    firstName
    lastName
  }
}
```

