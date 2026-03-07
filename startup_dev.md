#  Backend

## Database

- sudo apt-get update
- sudo apt-get install mysql-server
- sudo systemctl start mysql
- sudo mysql_secure_installation

### Create DB User

- sudo mysql
- create user angular identified by 'password';
- create database test;
- show databases;
- use test;
- grant all privileges on *.* to adam;
- flush privileges;

### Load DB schema

- cd backend
- mysql -u root -p < schema.sql

### Verify schema

- sudo mysql;
- use test;
- show tables;
- select * from users;

Update connection string in main.go if needed (line with DSN)

### Terminal 1: Start Go backend
- cd backend
- go mod tidy
- go run main.go

# Frontend

## Terminal 2: Start Angular
- ng serve

Login with: username=demo, password=demo123

