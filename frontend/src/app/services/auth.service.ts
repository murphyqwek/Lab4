import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { CredentialsPayload } from '../interfaces/credential.payload';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly TOKEN_KEY = 'auth-token';
  private readonly API_BASE_URL = "/api/auth"
  private readonly TOKEN_HEADER = 'Authorization';

  constructor(private http: HttpClient) {}

  login(payload: CredentialsPayload): Observable<string> {
    const url = `${this.API_BASE_URL}/login`;
    return this.http.post<any>(url, { 
      username: payload.username, 
      password: payload.password 
    }, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => this.parseToken(response))
    );
  }

  register(payload: CredentialsPayload): Observable<string> {
    const url = `${this.API_BASE_URL}/register`;
    return this.http.post<any>(url, { 
      username: payload.username, 
      password: payload.password 
    }, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => this.parseToken(response))
    );
  }

  private parseToken(response: HttpResponse<any>): string {
    const authHeader = response.headers.get(this.TOKEN_HEADER);
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        } else if (authHeader) {
            return authHeader;
        }
        return "";
  } 

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
  
  private isTokenExpired(token: string): boolean {
    let decodedToken = jwtDecode(token);

    if(decodedToken.exp === undefined) {
        return true;
    } 

    return decodedToken.exp * 1000 < Date.now();  
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }

    if(this.isTokenExpired(token)) {
        this.logout();
        return false;
    }

    return true; 
  }
}