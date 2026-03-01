# Angular & Go Communication Guide

## Overview of the Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Browser (Angular Application on localhost:4200)                 │
├─────────────────────────────────────────────────────────────────┤
│                          Angular App                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Components                                                │   │
│  │ ├─ LoginComponent                                         │   │
│  │ ├─ ProfileComponent                                       │   │
│  │ └─ etc.                                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓ (HTTP Requests)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ AuthService (Angular Service)                             │   │
│  │ - Sends HTTP requests to Go backend                       │   │
│  │ - Stores JWT token in localStorage                        │   │
│  │ - Attaches token to subsequent requests                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓ (HTTP)                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (Network)
┌─────────────────────────────────────────────────────────────────┐
│ Go Server (localhost:8080)                                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ CORS Middleware                                           │   │
│  │ - Allows requests from localhost:4200                    │   │
│  │ - Handles preflight OPTIONS requests                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ HTTP Router / Handler                                     │   │
│  │ ├─ POST /api/register → register()                       │   │
│  │ ├─ POST /api/login → login()                             │   │
│  │ └─ GET /api/profile → profile()                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Business Logic                                            │   │
│  │ - Hash passwords                                          │   │
│  │ - Validate credentials                                    │   │
│  │ - Generate JWT tokens                                     │   │
│  │ - Verify tokens                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Data Storage (In-memory for demo, Database in production) │   │
│  │ users := map[string]string{...}                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Communication Flow - Step by Step

### 1. **User Registration Flow**

**Step 1: Angular Component sends POST request**
```
Angular Component (LoginComponent)
    ↓
this.authService.register("john", "password123")
    ↓
HttpClient POST to http://localhost:8080/api/register
    ↓
Headers: {
  "Content-Type": "application/json"
}
Body: {
  "username": "john",
  "password": "password123"
}
```

**Step 2: CORS Preflight (Browser)**
```
Browser sees cross-origin request (different ports)
    ↓
Browser automatically sends OPTIONS request first
    ↓
OPTIONS http://localhost:8080/api/register
Headers: {
  "Origin": "http://localhost:4200",
  "Access-Control-Request-Method": "POST"
}
```

**Step 3: Go Server handles CORS preflight**
```
corsMiddleware checks:
    ✓ Origin is "http://localhost:4200" ✓
    ✓ Method POST is allowed ✓
    ✓ Headers are allowed ✓
    ↓
Returns 200 OK with CORS headers:
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type
```

**Step 4: Browser sends actual POST request**
```
Now safe, browser sends the real POST request
    ↓
POST /api/register
Body: {"username": "john", "password": "password123"}
```

**Step 5: Go Server processes registration**
```
register() handler:
    ↓
1. json.NewDecoder(r.Body).Decode(&user)
   - Parses JSON body into User struct
    ↓
2. Validates input (username and password not empty)
    ↓
3. Check if user already exists
    ↓
4. Hash password: hashPassword("password123")
   - Uses SHA256 for hashing
    ↓
5. Store in memory: users["john"] = "<hashed_password>"
    ↓
6. Return JSON response:
   {
     "message": "User registered successfully"
   }
```

**Step 6: Angular receives response**
```
Observable completes with response
    ↓
Component receives success
    ↓
User can now login
```

---

### 2. **User Login Flow**

**Step 1: Angular sends login request**
```
this.authService.login("john", "password123")
    ↓
POST http://localhost:8080/api/login
Body: {"username": "john", "password": "password123"}
```

**Step 2: Go Server validates credentials**
```
login() handler:
    ↓
1. Decode JSON body
    ↓
2. Find user in users map
    ↓
3. Hash provided password: hashPassword("password123")
    ↓
4. Compare with stored hash:
   if users["john"] == sha256("password123") {
       // Valid!
   } else {
       // Invalid!
       return 401 Unauthorized
   }
```

**Step 3: Go generates JWT Token**
```
If credentials valid:
    ↓
Create JWT payload (Claims struct):
{
  "username": "john",
  "exp": <timestamp 24 hours from now>,
  "iat": <current timestamp>
}
    ↓
Sign with secret key using HMAC-SHA256:
token = jwt.NewWithClaims(HS256, claims)
tokenString = token.SignedString(jwtSecret)
    ↓
Result: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ..."
```

**Step 4: Go sends token to Angular**
```
HTTP 200 OK
Response body:
{
  "token": "eyJhbGc...",
  "message": "Login successful"
}
```

**Step 5: Angular stores token**
```
AuthService.login() subscription receives response
    ↓
tap() operator intercepts:
    ↓
1. localStorage.setItem('token', response.token)
   - Stores token in browser's local storage (persistent)
    ↓
2. tokenSubject.next(response.token)
   - Updates BehaviorSubject (notifies subscribers)
    ↓
Component can now display logged-in state
```

---

### 3. **Protected Endpoint Access (With JWT)**

**Step 1: Angular requests profile**
```
this.authService.getProfile()
    ↓
Retrieve token: const token = localStorage.getItem('token')
    ↓
GET http://localhost:8080/api/profile
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}
```

**Step 2: Go validates token**
```
profile() handler:
    ↓
1. Read Authorization header:
   authHeader = "Bearer eyJhbGc..."
    ↓
2. Extract token (remove "Bearer " prefix):
   tokenString = "eyJhbGc..."
    ↓
3. Parse JWT using secret key:
   token, err := jwt.ParseWithClaims(tokenString, claims, func() {
       return jwtSecret  // Must match the signing key
   })
    ↓
4. Validate:
   - Check signature (hasn't been tampered with)
   - Check expiration time
   - Both must be valid
    ↓
If valid:
   claims.Username = "john"
   Return user data
    ↓
If invalid:
   Return 401 Unauthorized
```

**Step 3: Go returns protected data**
```
HTTP 200 OK
{
  "message": "Profile access granted",
  "username": "john"
}
```

**Step 4: Angular displays protected content**
```
Component receives data
    ↓
Displays user profile information
```

---

## Data Flow Summary

### Request-Response Cycle

```
ANGULAR SIDE                      NETWORK                          GO SIDE
(Frontend)                        (HTTP)                           (Backend)
─────────────────────────────────────────────────────────────────────────

User enters credentials in form
            ↓
AuthService.login(username, pwd)
            │
            ├─→ Validate input locally (optional)
            │
            └─→ Create HTTP request
                  Headers: Content-Type: application/json
                  Body: {username, password}
                  
                                  ↓ POST /api/login
                                  
                                  ← CORS Preflight (OPTIONS)
                                  
                                  ↓ Actual POST
                                  
                                           ↓
                                           Go Server receives POST
                                           ↓
                                           Parse JSON body
                                           ↓
                                           Hash password
                                           ↓
                                           Compare with stored hash
                                           ↓
                                           Generate JWT token (sign with secret)
                                           ↓
                                           Create JSON response
                                  
                                  ← HTTP 200 OK
                                  { token: "...", message: "..." }
                                  
            ← Response received
            ↓
            Extract token from response
            ↓
            Store in localStorage
            ↓
            Update auth state (BehaviorSubject)
            ↓
            Component receives notification
            ↓
            Display success message

─────────────────────────────────────────────────────────────────────────
```

## Key Concepts

### 1. **JSON (JavaScript Object Notation)**
- Format for exchanging data between Angular and Go
- **Angular**: Automatically serializes objects to JSON
- **Go**: Manually decodes JSON with `json.NewDecoder()` and encodes with `json.NewEncoder()`

### 2. **HTTP Methods**
- **POST**: Send data to server (login, register)
- **GET**: Request data from server (profile)
- **OPTIONS**: Browser sends automatically for CORS (preflight)

### 3. **CORS (Cross-Origin Resource Sharing)**
- **Problem**: Browser prevents requests to different origins (different ports = different origin)
- **Solution**: Go sets CORS headers to allow requests from Angular
- **Headers**:
  - `Access-Control-Allow-Origin`: Which origins can access
  - `Access-Control-Allow-Methods`: Which HTTP methods allowed
  - `Access-Control-Allow-Headers`: Which headers allowed

### 4. **JWT (JSON Web Tokens)**
- **Structure**: `header.payload.signature`
  - `header`: Algorithm info (HS256)
  - `payload`: Claims (username, expiration, etc.)
  - `signature`: HMAC-SHA256(header + payload + secret)
  
- **Why**: Stateless authentication, no server-side session storage needed
- **How it works**:
  1. Server generates token and signs with secret
  2. Client stores token
  3. Client sends token with each request
  4. Server verifies signature using same secret
  5. If signature valid = token wasn't tampered with

### 5. **Authorization Header**
- Format: `Authorization: Bearer <token>`
- Used for all protected endpoints
- Browser sends automatically because it's in `Access-Control-Allow-Headers`

## Implementation Checklist

```
Go Backend:
✓ Create HTTP server on port 8080
✓ Set up CORS for localhost:4200
✓ Create /api/register endpoint
✓ Create /api/login endpoint with JWT
✓ Create protected /api/profile endpoint
✓ Add password hashing (SHA256)

Angular Frontend:
✓ Create AuthService
✓ HttpClient for HTTP requests
✓ Store token in localStorage
✓ Attach token to request headers
✓ Use async/await or RxJS subscribe()
✓ Handle success and error responses
✓ Optional: Implement Auth Guard for protected routes
```

## Testing the Flow

```bash
# Terminal 1: Start Go server
cd backend
go run main.go
# Output: Server running on http://localhost:8080

# Terminal 2: Test with curl
# Register
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Login
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
# Returns: {"token":"eyJh...","message":"Login successful"}

# Access protected endpoint
curl -X GET http://localhost:8080/api/profile \
  -H "Authorization: Bearer eyJh..."
# Returns: {"message":"Profile access granted","username":"demo"}
```

## What Happens Behind the Scenes

When Angular sends: `this.http.post('/api/login', {username, password})`

1. **HttpClient** (Angular) converts it to:
   ```
   POST /api/login HTTP/1.1
   Host: localhost:8080
   Content-Type: application/json
   Origin: http://localhost:4200
   
   {"username":"demo","password":"demo123"}
   ```

2. **Browser** sees different origin, sends preflight:
   ```
   OPTIONS /api/login HTTP/1.1
   Origin: http://localhost:4200
   Access-Control-Request-Method: POST
   ```

3. **Go Server** (corsMiddleware) responds:
   ```
   HTTP/1.1 200 OK
   Access-Control-Allow-Origin: http://localhost:4200
   Access-Control-Allow-Methods: GET, POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```

4. **Browser** sees green light, sends actual request

5. **Go Server** processes and responds:
   ```
   HTTP/1.1 200 OK
   Content-Type: application/json
   
   {"token":"eyJh...","message":"Login successful"}
   ```

6. **Angular** receives, stores token, updates UI
