import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorage } from '../auth/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenStorage).getToken();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return next(req.clone({ setHeaders: headers }));
};