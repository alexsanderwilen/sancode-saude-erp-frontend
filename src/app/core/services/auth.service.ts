
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl + '/auth';
  private userSubject: BehaviorSubject<any | null>;
  public currentUser: Observable<any | null>;

  public get currentUserValue(): any | null {
    return this.userSubject.getValue();
  }

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<any | null>(null);
    this.currentUser = this.userSubject.asObservable();
    this.loadUserFromToken();
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          this.decodeAndSetUser(response.accessToken);
        }
      })
    );
  }

  register(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userInfo);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          this.userSubject.next(decoded);
        } else {
          this.logout();
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        this.logout();
      }
    }
  }

  private decodeAndSetUser(token: string): void {
    try {
      const decoded: any = jwtDecode(token);
      this.userSubject.next(decoded);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      this.logout();
    }
  }
}

