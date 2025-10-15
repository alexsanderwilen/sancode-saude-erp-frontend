
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();
    console.log('JwtInterceptor: Token from localStorage:', token ? 'present' : 'null');
    console.log('JwtInterceptor: Request URL:', request.url);
    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('JwtInterceptor: Added Authorization header: Bearer ' + token.substring(0, 20) + '...');
    } else {
        console.log('JwtInterceptor: No token found, skipping header');
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            console.log('JwtInterceptor: Error status:', error.status, 'URL:', request.url);
            if (error.status === 403) {
                authService.logout();
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
