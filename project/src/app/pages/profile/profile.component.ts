import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div *ngIf="loading" class="loading">Loading profile...</div>
      
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div *ngIf="profileData && !loading" class="profile-card">
        <div class="profile-header">
          <div class="avatar">{{ getInitial() }}</div>
          <h1>{{ profileData.username }}</h1>
        </div>
        
        <div class="profile-info">
          <div class="info-item">
            <span class="label">Username:</span>
            <span class="value">{{ profileData.username }}</span>
          </div>
          
          <div class="info-item">
            <span class="label">Status:</span>
            <span class="value badge">Active</span>
          </div>
        </div>
        
        <div class="actions">
          <button class="btn-logout" (click)="onLogout()">Logout</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
    }
    
    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1.1rem;
    }
    
    .error {
      color: #dc3545;
      background-color: #f8d7da;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .profile-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 2rem;
    }
    
    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid #f0f0f0;
    }
    
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: bold;
      margin: 0 auto 1rem;
      text-transform: uppercase;
    }
    
    h1 {
      color: #333;
      margin: 0;
      font-size: 2rem;
    }
    
    .profile-info {
      margin-bottom: 2rem;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .info-item:last-child {
      border-bottom: none;
    }
    
    .label {
      font-weight: 600;
      color: #555;
    }
    
    .value {
      color: #333;
    }
    
    .badge {
      background-color: #28a745;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.9rem;
    }
    
    .actions {
      text-align: center;
    }
    
    .btn-logout {
      padding: 0.75rem 2rem;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.3s;
    }
    
    .btn-logout:hover {
      background-color: #c82333;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileData: any = null;
  loading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Fetch profile data from backend
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.profileData = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401) {
          // Token expired or invalid, redirect to login
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.error = 'Failed to load profile. Please try again.';
        }
      }
    });
  }

  getInitial(): string {
    return this.profileData?.username?.charAt(0).toUpperCase() || 'U';
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
