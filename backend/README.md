# Go Backend for Angular Application

## Database
This backend uses **MySQL** to persist user data. Users are saved to the database and survive server restarts.

## Setup & Run

1. **Set up MySQL database** (see [MYSQL_SETUP.md](MYSQL_SETUP.md)):
   ```bash
   mysql -u root -p angular_auth < schema.sql
   ```

2. **Update connection string** in `main.go` if needed (default: `root:password@tcp(localhost:3306)/angular_auth`)

3. **Install Go dependencies:**
   ```bash
   go mod tidy
   ```

4. **Run the server:**
   ```bash
   go run main.go
   ```

Expected output:
```
✓ Connected to MySQL database
Server running on http://localhost:8080
```

## Demo Credentials
- **Username:** demo
- **Password:** demo123

## API Endpoints

### 1. Register
- **POST** `/api/register`
- **Body:**
  ```json
  {
    "username": "john",
    "password": "secret123"
  }
  ```

### 2. Login
- **POST** `/api/login`
- **Body:**
  ```json
  {
    "username": "demo",
    "password": "demo123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "Login successful"
  }
  ```

### 3. Profile (Protected)
- **GET** `/api/profile`
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
  {
    "message": "Profile access granted",
    "username": "demo"
  }
  ```

## CORS Configuration
The backend allows requests from `http://localhost:4200` (Angular dev server).
