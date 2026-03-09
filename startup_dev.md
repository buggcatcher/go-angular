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
- grant all privileges on *.* to angular;
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

### Docker alternative (recommended)

- cd /home/adam/Desktop/go-angular
- docker compose up -d
- docker compose ps
- docker compose logs -f mysql

MySQL is started automatically with:

- database: test
- user: angular
- password: password
- port: 3306

The schema is loaded from `backend/schema.sql` on first startup.

The container has a volume set up for data persistence

Stop MySQL container:

- docker compose down

Reset DB completely (WARNING: deletes all data):

- docker compose down -v

### Terminal 1: Start Go backend
- cd backend
- go mod tidy
- go run main.go | go run .

# Frontend

## Terminal 2: Start Angular
- ng serve | npm start 

Login with: username=demo, password=demo123

