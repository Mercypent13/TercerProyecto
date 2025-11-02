import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.API_BASE_URL}/usuarios`;
  private http = inject(HttpClient);
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();



  private saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.isAuthenticatedSubject.next(true);
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  
  private hasToken(): boolean {
    return !!this.getToken();
  }

  signupUser(data: SignupData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        if (response.token) {
           this.saveToken(response.token);
        }
      })
    );
  }

  loginUser(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        if (response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }
  
  checkAuthStatus(): Observable<boolean> {
    return this.isAuthenticated$;
  }
  
  getAuthorizationToken(): string | null {
    return this.getToken();
  }
}
