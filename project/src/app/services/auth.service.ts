import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface AuthResponse {
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private loggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  public isLoggedIn$ = this.loggedInSubject.asObservable();
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  public username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {}

  private checkLoginStatus(): boolean {
    return !!localStorage.getItem('username');
  }

  register(username: string, password: string): Observable<string> {
    const formData = new URLSearchParams();
    formData.set('username', username);
    formData.set('password', password);

    return this.http.post(`${this.apiUrl}/register`, formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'text',
      withCredentials: true
    });
  }

  login(username: string, password: string): Observable<string> {
    const formData = new URLSearchParams();
    formData.set('username', username);
    formData.set('password', password);

    return this.http.post(`${this.apiUrl}/login`, formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'text',
      withCredentials: true
    }).pipe(
      tap(() => {
        localStorage.setItem('username', username);
        this.loggedInSubject.next(true);
        this.usernameSubject.next(username);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, null, {
      responseType: 'text',
      withCredentials: true
    }).pipe(
      tap(() => {
        localStorage.removeItem('username');
        this.loggedInSubject.next(false);
        this.usernameSubject.next(null);
      })
    );
  }

  isLoggedIn(): boolean {
    return this.checkLoginStatus();
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getCsrfToken(): string | null {
    const match = document.cookie.match(/csrf_token=([^;]+)/);
    return match ? match[1] : null;
  }
}
