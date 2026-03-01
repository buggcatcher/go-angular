# Angular + Go Authentication System

A full-stack authentication application built with Angular (frontend) and Go (backend), featuring JWT-based authentication and MySQL/MariaDB database integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Communication Flow](#communication-flow)
- [Security Considerations](#security-considerations)

---

## 🎯 Overview

This project demonstrates a complete authentication system with:
- **User registration** with password validation
- **User login** with JWT token generation
- **Protected routes** requiring authentication
- **Profile page** displaying user information
- **Persistent storage** using MySQL/MariaDB
- **CORS configuration** for cross-origin requests

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Angular)                         │
│                   http://localhost:4200                      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │    Login     │  │   Register   │  │   Profile    │       │
│  │  Component   │  │   Component  │  │  Component   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  Auth Service  │                        │
│                    │  (HttpClient)  │                        │
│                    └───────┬────────┘                        │
│                            │                                 │
│                     Stores JWT Token                         │
│                     in localStorage                          │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                     HTTP Requests
                     (JSON Format)
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Go Backend Server                         │
│                   http://localhost:8080                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              CORS Middleware                          │   │
│  │  Allows requests from localhost:4200                  │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │              HTTP Router                              │   │
│  │  /api/register  → register()                          │   │
│  │  /api/login     → login()                             │   │
│  │  /api/profile   → profile() [Protected]              │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │           Business Logic                              │   │
│  │  • Hash passwords (SHA256)                            │   │
│  │  • Validate credentials                               │   │
│  │  • Generate JWT tokens                                │   │
│  │  • Verify JWT signatures                              │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │           Database Layer (database.go)                │   │
│  │  • GetUserByUsername()                                │   │
│  │  • CreateUser()                                       │   │
│  │  • UserExists()                                       │   │
│  └──────────────────┬───────────────────────────────────┘   │
└─────────────────────┼─────────────────────────────────────┘
                      │
                      │ SQL Queries
                      │
┌─────────────────────▼─────────────────────────────────────┐
│               MySQL/MariaDB Database                       │
│                   localhost:3306/test                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  users table                                         │  │
│  │  • id (INT, PRIMARY KEY, AUTO_INCREMENT)            │  │
│  │  • username (VARCHAR, UNIQUE)                       │  │
│  │  • password_hash (VARCHAR)                          │  │
│  │  • created_at (TIMESTAMP)                           │  │
│  │  • updated_at (TIMESTAMP)                           │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Backend (Go)
- ✅ RESTful API with 3 endpoints
- ✅ JWT token generation and validation
- ✅ Password hashing using SHA256
- ✅ MySQL/MariaDB integration
- ✅ CORS middleware for cross-origin requests
- ✅ Error handling and validation
- ✅ Secure token signing with HMAC-SHA256

### Frontend (Angular)
- ✅ Login form with validation
- ✅ Registration form with password confirmation
- ✅ Protected profile page
- ✅ JWT token storage in localStorage
- ✅ Automatic token attachment to requests
- ✅ Route guards (redirect to login if not authenticated)
- ✅ Auto-login after registration
- ✅ Responsive design with modern UI
- ✅ Error and success message handling

---

## 🛠️ Technology Stack

### Backend
- **Language**: Go 1.21+
- **Database**: MySQL/MariaDB
- **Libraries**:
  - `github.com/golang-jwt/jwt/v5` - JWT token handling
  - `github.com/go-sql-driver/mysql` - MySQL driver
  - `crypto/sha256` - Password hashing
  - `net/http` - HTTP server (standard library)

### Frontend
- **Framework**: Angular 17+ (Standalone Components)
- **Language**: TypeScript
- **Libraries**:
  - `@angular/common/http` - HTTP client
  - `@angular/router` - Routing
  - `@angular/forms` - Form handling (FormsModule)
  - RxJS - Reactive programming

### Database
- **Database**: MySQL 8.0+ or MariaDB 10.11+
- **Schema**: Single `users` table with indexed username

---

## 📁 Project Structure

```
angular/
├── backend/                        # Go backend server
│   ├── main.go                     # Main server file with routes
│   ├── database.go                 # Database connection and queries
│   ├── go.mod                      # Go module dependencies
│   ├── go.sum                      # Dependency checksums
│   ├── schema.sql                  # Database schema
│   ├── README.md                   # Backend documentation
│   └── MYSQL_SETUP.md             # MySQL setup guide
│
├── project/                        # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── header/        # Navigation header
│   │   │   │   ├── footer/        # Footer component
│   │   │   │   └── login/         # Login & Register component
│   │   │   │       └── login.component.ts
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── homepage/      # Homepage
│   │   │   │   ├── about/         # About page
│   │   │   │   └── profile/       # Protected profile page
│   │   │   │       └── profile.component.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts # Authentication service
│   │   │   │
│   │   │   ├── app.config.ts      # App configuration
│   │   │   ├── app.routes.ts      # Route definitions
│   │   │   ├── app.ts             # Root component
│   │   │   ├── app.html           # Root template
│   │   │   └── app.css            # Root styles
│   │   │
│   │   ├── index.html              # HTML entry point
│   │   ├── main.ts                 # TypeScript entry point
│   │   └── styles.css              # Global styles
│   │
│   ├── angular.json                # Angular configuration
│   ├── package.json                # npm dependencies
│   └── tsconfig.json               # TypeScript configuration
│
├── ANGULAR_GO_COMMUNICATION.md     # Detailed communication guide
├── QUICK_START.md                  # Quick start guide
└── README.md                       # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v18+) and npm
- **Go** (v1.21+)
- **MySQL** or **MariaDB**
- **Angular CLI** (optional): `npm install -g @angular/cli`

### 1. Database Setup

Start MySQL/MariaDB:
```bash
# Linux
sudo systemctl start mariadb

# Check status
sudo systemctl status mariadb
```

Create a MySQL user and database:
```bash
mysql -u root -p
```

In MySQL shell:
```sql
-- Create database
CREATE DATABASE test;

-- Create user (optional)
CREATE USER 'angular'@'localhost' IDENTIFIED BY 'angular123';
GRANT ALL PRIVILEGES ON test.* TO 'angular'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Load the schema:
```bash
cd backend
mysql -u angular -pangular123 test < schema.sql
```

Verify the table was created:
```bash
mysql -u angular -pangular123 test -e "DESCRIBE users;"
```

### 2. Backend Setup

Install Go dependencies:
```bash
cd backend
go mod tidy
```

Run the Go server:
```bash
go run .
```

Expected output:
```
✓ Connected to MySQL database
Server running on http://localhost:8080
```

### 3. Frontend Setup

Install npm dependencies:
```bash
cd project
npm install
```

Start the Angular development server:
```bash
ng serve
```

Expected output:
```
Application bundle generation complete.
Watch mode enabled. Watching for file changes...
➜  Local:   http://localhost:4200/
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:4200
```

---

## 🔄 How It Works

### Step-by-Step Authentication Flow

#### 1. User Registration

```
User fills registration form
    ↓
Angular → POST http://localhost:8080/api/register
Request Body: { "username": "john", "password": "secret123" }
    ↓
Browser sends OPTIONS (CORS preflight)
    ↓
Go Server validates CORS → Returns 200 OK with headers
    ↓
Browser sends actual POST request
    ↓
Go Server:
  1. Validates input (username & password not empty)
  2. Checks if user already exists (UserExists)
  3. Hashes password using SHA256
  4. Inserts into database (CreateUser)
  5. Returns: { "message": "User registered successfully" }
    ↓
Angular receives success response
    ↓
Auto-login: Angular immediately logs user in with same credentials
    ↓
Redirects to profile page
```

#### 2. User Login

```
User enters credentials
    ↓
Angular → POST http://localhost:8080/api/login
Request Body: { "username": "john", "password": "secret123" }
    ↓
Go Server:
  1. Queries database for user (GetUserByUsername)
  2. Hashes provided password
  3. Compares hashes
  4. If match:
     - Creates JWT payload with username and expiration (24 hours)
     - Signs token with secret key (HMAC-SHA256)
     - Returns: { "token": "eyJhbGc...", "message": "Login successful" }
  5. If no match:
     - Returns: 401 Unauthorized
    ↓
Angular receives token
    ↓
Stores token in localStorage.setItem('token', token)
    ↓
Updates BehaviorSubject (notifies all subscribers)
    ↓
Redirects to profile page
```

#### 3. Accessing Protected Routes

```
User navigates to /profile
    ↓
Angular ProfileComponent loads
    ↓
Checks if user is logged in (token exists in localStorage)
    ↓
If not logged in → Redirect to /login
    ↓
If logged in → GET http://localhost:8080/api/profile
Request Headers: { "Authorization": "Bearer eyJhbGc..." }
    ↓
Go Server:
  1. Extracts token from Authorization header
  2. Parses JWT token
  3. Verifies signature using secret key
  4. Checks expiration time
  5. If valid:
     - Returns: { "username": "john", "message": "Profile access granted" }
  6. If invalid:
     - Returns: 401 Unauthorized
    ↓
Angular receives profile data
    ↓
Displays user information on profile page
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### 1. Register User

**Endpoint**: `POST /api/register`

**Request**:
```json
{
  "username": "john",
  "password": "secret123"
}
```

**Success Response** (201 Created):
```json
{
  "message": "User registered successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request body or missing fields
- `409 Conflict`: User already exists

---

### 2. Login User

**Endpoint**: `POST /api/login`

**Request**:
```json
{
  "username": "john",
  "password": "secret123"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJleHAiOjE3MDk0MDcyMDB9.signature",
  "message": "Login successful"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Invalid credentials

---

### 3. Get Profile (Protected)

**Endpoint**: `GET /api/profile`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response** (200 OK):
```json
{
  "username": "john",
  "message": "Profile access granted"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token

---

## 🎨 Frontend Components

### 1. LoginComponent (`/login`)

**Features**:
- Tabbed interface (Login / Register)
- Form validation
- Password confirmation for registration
- Error and success messages
- Auto-redirect after successful authentication

**Key Methods**:
- `onLogin()`: Authenticates user and redirects to profile
- `onRegister()`: Registers new user, auto-logs in, and redirects
- `clearMessages()`: Clears error/success messages

---

### 2. ProfileComponent (`/profile`)

**Features**:
- Protected route (requires authentication)
- Fetches user data from backend
- Displays user avatar with initial
- Shows username and status
- Logout button

**Key Methods**:
- `ngOnInit()`: Checks authentication and fetches profile data
- `onLogout()`: Logs out user and redirects to login

---

### 3. AuthService

**Purpose**: Centralized authentication service

**Key Methods**:
```typescript
// Register new user
register(username: string, password: string): Observable<AuthResponse>

// Login user and store token
login(username: string, password: string): Observable<AuthResponse>

// Logout user (remove token)
logout(): void

// Get profile data (with token in header)
getProfile(): Observable<any>

// Check if user is logged in
isLoggedIn(): boolean

// Get stored token
getToken(): string | null
```

**Token Storage**:
- Stored in `localStorage` under key `token`
- Automatically attached to protected API requests
- Managed via RxJS `BehaviorSubject` for reactive state

---

## 🔐 Communication Flow Details

### CORS (Cross-Origin Resource Sharing)

**Problem**: Angular runs on `localhost:4200`, Go runs on `localhost:8080` (different ports = different origins)

**Solution**: Go backend includes CORS middleware

```go
func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next.ServeHTTP(w, r)
    })
}
```

**Flow**:
1. Browser sees cross-origin request
2. Sends `OPTIONS` request (preflight) automatically
3. Go responds with CORS headers
4. Browser allows actual request to proceed

---

### JWT Token Structure

**Format**: `header.payload.signature`

**Example**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJleHAiOjE3MDk0MDcyMDB9.Rv7XUEkI85b_jlGp4F3H5kQP2JX8XdVK4B-Lz4x3Kx0
```

**Header** (base64 encoded):
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload** (base64 encoded):
```json
{
  "username": "john",
  "exp": 1709407200,
  "iat": 1709320800
}
```

**Signature**: HMAC-SHA256 hash of `header.payload` signed with secret key

---

### Password Security

**Hashing Algorithm**: SHA256

```go
func hashPassword(password string) string {
    hash := sha256.Sum256([]byte(password))
    return fmt.Sprintf("%x", hash)
}
```

**Example**:
- Password: `demo123`
- Hash: `7c4a8d09ca3762af61e59520943dc26494f8941b`

**Note**: For production, use bcrypt instead of SHA256 for better security.

---

## 🔒 Security Considerations

### Current Implementation (Development)
- ✅ JWT tokens with expiration (24 hours)
- ✅ Password hashing (SHA256)
- ✅ CORS configuration
- ✅ SQL parameterized queries (prevents SQL injection)
- ✅ Input validation

### Production Recommendations
⚠️ **This is a demo system. For production, implement:**

1. **Password Hashing**: Use bcrypt instead of SHA256
   ```go
   import "golang.org/x/crypto/bcrypt"
   bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
   ```

2. **HTTPS**: Use TLS certificates
   ```go
   http.ListenAndServeTLS(":443", "cert.pem", "key.pem", handler)
   ```

3. **Secure JWT Secret**: Use environment variables
   ```go
   jwtSecret := []byte(os.Getenv("JWT_SECRET"))
   ```

4. **Refresh Tokens**: Implement token rotation
5. **Rate Limiting**: Prevent brute force attacks
6. **CSRF Protection**: Add CSRF tokens
7. **Secure Cookies**: Store tokens in httpOnly cookies instead of localStorage
8. **Environment Variables**: Store database credentials securely
9. **Input Sanitization**: Additional validation on all inputs
10. **Logging & Monitoring**: Log security events

---

## 🧪 Testing the Application

### Manual Testing

**1. Test Registration:**
```bash
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

**2. Test Login:**
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

**3. Test Protected Endpoint:**
```bash
# Save token from login response
TOKEN="your_token_here"

curl -X GET http://localhost:8080/api/profile \
  -H "Authorization: Bearer $TOKEN"
```

**4. Test Invalid Token:**
```bash
curl -X GET http://localhost:8080/api/profile \
  -H "Authorization: Bearer invalid_token"
```

---

### Browser Testing

1. **Open DevTools** (F12)
2. **Network Tab**: See all HTTP requests
3. **Console Tab**: Check for errors
4. **Application Tab** → **Local Storage**: View stored token

---

## 🐛 Troubleshooting

### Backend Issues

**Error**: `Failed to connect to database`
- Check if MySQL/MariaDB is running: `sudo systemctl status mariadb`
- Verify connection string in `main.go`
- Check database user has correct permissions

**Error**: `undefined: UserExists`
- Make sure both `main.go` and `database.go` are compiled together
- Run: `go run .` (not just `go run main.go`)

---

### Frontend Issues

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
- Ensure Go backend is running on port 8080
- Check that Angular is running on port 4200
- Verify CORS middleware is enabled in Go

**Error**: `Cannot find module '@angular/common/http'`
- Run: `npm install`
- Check that `provideHttpClient()` is in `app.config.ts`

**Issue**: Login form doesn't show
- Check that route `/login` is defined in `app.routes.ts`
- Verify `LoginComponent` is imported correctly

---

## 📚 Additional Documentation

- [ANGULAR_GO_COMMUNICATION.md](ANGULAR_GO_COMMUNICATION.md) - Detailed explanation of how Angular and Go communicate
- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [backend/README.md](backend/README.md) - Backend-specific documentation
- [backend/MYSQL_SETUP.md](backend/MYSQL_SETUP.md) - MySQL setup guide

---

## 🎓 What You Learned

This project demonstrates:

1. **Full-Stack Development**: Frontend and backend integration
2. **RESTful APIs**: Proper HTTP methods and status codes
3. **Authentication**: JWT-based stateless authentication
4. **Database Integration**: CRUD operations with MySQL
5. **CORS**: Handling cross-origin requests
6. **Security**: Password hashing, token validation
7. **Angular Services**: Centralized state management
8. **Reactive Programming**: RxJS Observables
9. **Routing**: Protected routes and navigation
10. **Modern Go**: Modular code structure

---

## 📝 License

This is a demo/educational project. Feel free to use it for learning purposes.

---

## 👨‍💻 Demo Credentials

**Username**: `demo`  
**Password**: `demo123`

This user is pre-loaded in the database via `schema.sql`.

---

**Built with ❤️ using Angular and Go**
