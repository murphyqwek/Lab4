import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly TOKEN_KEY = 'auth-token';

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

    return decodedToken.exp < Date.now();  
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