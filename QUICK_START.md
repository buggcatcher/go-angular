# Quick Start Guide

## Prerequisites
- Node.js & npm (for Angular)
- Go 1.21+ (for backend)
- Angular CLI (optional)

## Step 1: Set up Go Backend

```bash
# Navigate to backend directory
cd backend

# Download dependencies
go mod tidy

# Run the server
go run main.go
```

Expected output:
```
Server running on http://localhost:8080
```

The server is now listening for requests from your Angular app.

## Step 2: Update Angular App (Add HttpClientModule)

Your `app.config.ts` should have `provideHttpClient()`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()  // ← Required for HTTP calls
  ]
};
```

## Step 3: Use the AuthService in Your Components

### Example 1: Login Component

```typescript
import { AuthService } from './services/auth.service';

export class MyComponent {
  constructor(private authService: AuthService) {}

  login() {
    this.authService.login('demo', 'demo123').subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        console.log('Token stored:', this.authService.getToken());
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}
```

### Example 2: Access Protected Endpoint

```typescript
export class ProfileComponent {
  userProfile: any;

  constructor(private authService: AuthService) {}

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (error) => {
        console.error('Access denied:', error);
      }
    });
  }
}
```

## Step 4: Test the Flow

### Option A: Using the UI (Recommended)
1. Start Go backend (`go run main.go`)
2. Start Angular dev server (`ng serve`)
3. Navigate to `http://localhost:4200`
4. Use the login component with demo credentials

### Option B: Using curl (Terminal Testing)

```bash
# 1. Register a new user
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret123"}'

# 2. Login
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
# Copy the token from response

# 3. Access protected endpoint (replace TOKEN with actual token)
curl -X GET http://localhost:8080/api/profile \
  -H "Authorization: Bearer TOKEN"
```

## What's Happening Behind the Scenes

1. **Angular Component** → User clicks login
2. **AuthService** → Sends HTTP POST to `http://localhost:8080/api/login`
3. **Browser CORS** → Sends OPTIONS preflight request first
4. **Go Server** → Receives OPTIONS, responds with CORS headers
5. **Browser** → Sees CORS is allowed, sends actual POST request
6. **Go Server** → 
   - Validates credentials
   - Hashes password and compares with stored hash
   - Generates JWT token (signed with secret)
   - Returns token in response
7. **Angular AuthService** → 
   - Receives response with token
   - Stores token in localStorage
   - Updates BehaviorSubject (notifies subscribers)
8. **Angular Component** → Displays success message

## For Protected Endpoints

1. **Angular Component** → Calls `getProfile()`
2. **AuthService** → Retrieves token from localStorage
3. **AuthService** → Adds `Authorization: Bearer <token>` header
4. **Go Server** → 
   - Extracts token from header
   - Verifies token signature using secret key
   - Checks if token is expired
   - If valid: returns protected data
   - If invalid: returns 401 Unauthorized
5. **Angular** → Receives data and displays

## Security Notes

⚠️ **This is a minimal demo. For production:**

1. Replace `jwtSecret` with secure, complex secret
2. Use a proper database instead of in-memory storage
3. Add password validation rules (min length, complexity, etc.)
4. Use HTTPS instead of HTTP
5. Add refresh token rotation
6. Implement rate limiting
7. Add CSRF protection
8. Use secure cookies for tokens instead of localStorage
9. Implement proper logging and monitoring
10. Add input validation and sanitization

## Troubleshooting

### "No 'Access-Control-Allow-Origin' header" error
- Make sure Go server is running (`go run main.go`)
- Check that CORS middleware is enabled
- Verify Angular is running on `http://localhost:4200`

### "Invalid token" error
- Token might be expired (24 hour limit in current setup)
- Try logging in again to get a fresh token

### "Invalid credentials" error
- Check username and password
- For demo: username=`demo`, password=`demo123`
- Or register a new user first

## Next Steps

1. Add database integration (MongoDB, PostgreSQL, etc.)
2. Add email verification for registration
3. Implement refresh tokens
4. Add role-based access control
5. Create more API endpoints (CRUD operations)
6. Add request validation and error handling
7. Deploy to production (Heroku, AWS, etc.)
