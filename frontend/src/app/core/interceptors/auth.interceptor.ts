import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorage } from '../auth/token-storage.service';

/*
Composant
   ↓
ApiService.get()
   ↓
HttpClient
   ↓
authInterceptor
   ↓
TokenStorage.getToken()
   ↓
token trouvé
   ↓
création des headers
   ↓
req.clone(...)
   ↓
next(...)
   ↓
requête HTTP
   ↓
Laravel
*/

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenStorage).getToken();
  const headers: Record<string, string> = { Accept: 'application/json' };

  console.log('[AUTH INTERCEPTOR]');
  console.log('URL:', req.url);
  console.log('Token:', token);

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('Headers:', headers);
  return next(req.clone({ setHeaders: headers }));
};