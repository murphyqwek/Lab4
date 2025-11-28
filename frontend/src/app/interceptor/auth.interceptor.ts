// auth.interceptor.ts
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    let modifiedRequest = req;

    const token = authService.getToken();

    if (token) {
        modifiedRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    }

    return next(modifiedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            console.log(error.message);
            console.log(error.error)


            if (error.status === 401) {
                authService.logout(); 
                
                router.navigate(['/login']);
            }    
            return throwError(() => error);
        })
    );
};