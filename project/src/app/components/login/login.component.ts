import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [FormsModule],
    template: `
    <div class="login-container">
      <div class="tabs">
        <button
          class="tab-button"
          [class.active]="activeTab === 'login'"
          (click)="activeTab = 'login'; clearMessages()">
          Login
        </button>
        <button
          class="tab-button"
          [class.active]="activeTab === 'register'"
          (click)="activeTab = 'register'; clearMessages()">
          Register
        </button>
      </div>
    
      @if (error) {
        <div class="error">{{ error }}</div>
      }
      @if (message) {
        <div class="success">{{ message }}</div>
      }
    
      <!-- Login Form -->
      @if (activeTab === 'login' && !isLoggedIn) {
        <form (ngSubmit)="onLogin()">
          <h2>Login</h2>
          <div class="form-group">
            <label>Username:</label>
            <input [(ngModel)]="username" name="username" required type="text" placeholder="Enter username">
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input [(ngModel)]="password" name="password" required type="password" placeholder="Enter password">
          </div>
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
          <p class="hint">Demo credentials: username=<strong>demo</strong>, password=<strong>demo123</strong></p>
        </form>
      }
    
      <!-- Registration Form -->
      @if (activeTab === 'register' && !isLoggedIn) {
        <form (ngSubmit)="onRegister()">
          <h2>Register</h2>
          <div class="form-group">
            <label>Username:</label>
            <input [(ngModel)]="regUsername" name="regUsername" required type="text" placeholder="Choose a username">
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input [(ngModel)]="regPassword" name="regPassword" required type="password" placeholder="Choose a password">
          </div>
          <div class="form-group">
            <label>Confirm Password:</label>
            <input [(ngModel)]="regConfirmPassword" name="regConfirmPassword" required type="password" placeholder="Confirm password">
          </div>
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>
      }
    
      <!-- Logged In View -->
      @if (isLoggedIn) {
        <div class="profile">
          <h2>Profile</h2>
          <p>Welcome, <strong>{{ loggedInUser }}</strong>!</p>
          <button (click)="onLogout()">Logout</button>
        </div>
      }
    </div>
    `,
    styles: [`
    .login-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .tab-button {
      flex: 1;
      padding: 0.75rem;
      background-color: #f0f0f0;
      color: #555;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s;
    }
    
    .tab-button.active {
      background-color: #007bff;
      color: white;
    }
    
    .tab-button:hover:not(.active) {
      background-color: #e0e0e0;
    }
    
    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    
    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0,123,255,0.3);
    }
    
    button[type="submit"] {
      width: 100%;
      padding: 0.75rem;
      margin-top: 1rem;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
    }
    
    button[type="submit"]:hover:not(:disabled) {
      background-color: #218838;
    }
    
    button[type="submit"]:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .error {
      color: #dc3545;
      background-color: #f8d7da;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .success {
      color: #155724;
      background-color: #d4edda;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .profile {
      text-align: center;
    }
    
    .profile button {
      width: auto;
      padding: 0.75rem 2rem;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 1rem;
    }
    
    .profile button:hover {
      background-color: #c82333;
    }
    
    .hint {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #666;
      text-align: center;
    }
    
    p {
      margin-bottom: 0.5rem;
    }
  `]
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';
  
  // Login fields
  username = '';
  password = '';
  
  // Registration fields
  regUsername = '';
  regPassword = '';
  regConfirmPassword = '';
  
  // Common fields
  loading = false;
  error = '';
  message = '';
  isLoggedIn = false;
  loggedInUser = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Check if already logged in on component init
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      // Redirect to profile if already logged in
      this.router.navigate(['/profile']);
    }
  }

  clearMessages(): void {
    this.error = '';
    this.message = '';
  }

  onLogin(): void {
    this.error = '';
    this.message = '';
    this.loading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        this.message = response.message || 'Login successful!';
        this.isLoggedIn = true;
        this.loggedInUser = this.username;
        // Redirect to profile
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 500);
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401) {
          this.error = 'Invalid username or password';
        } else if (error.error && error.error.error) {
          this.error = error.error.error;
        } else {
          this.error = 'An error occurred. Please try again.';
        }
      }
    });
  }

  onRegister(): void {
    this.error = '';
    this.message = '';

    // Validation
    if (!this.regUsername || !this.regPassword || !this.regConfirmPassword) {
      this.error = 'All fields are required';
      return;
    }

    if (this.regPassword !== this.regConfirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.regPassword.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;

    this.authService.register(this.regUsername, this.regPassword).subscribe({
      next: (response) => {
        this.loading = false;
        this.message = 'Registration successful! Logging you in...';
        
        // Auto-login after registration
        const username = this.regUsername;
        const password = this.regPassword;
        
        this.regUsername = '';
        this.regPassword = '';
        this.regConfirmPassword = '';
        
        // Login and redirect to profile
        setTimeout(() => {
          this.authService.login(username, password).subscribe({
            next: () => {
              this.router.navigate(['/profile']);
            },
            error: () => {
              this.error = 'Registration successful but auto-login failed. Please login manually.';
              this.activeTab = 'login';
            }
          });
        }, 500);
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 409) {
          this.error = 'Username already exists';
        } else if (error.error && error.error.error) {
          this.error = error.error.error;
        } else {
          this.error = 'Registration failed. Please try again.';
        }
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.loggedInUser = '';
    this.message = 'Logged out successfully';
  }
}
