import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../../shared/components/ui/snackbar/snackbar.service';
import { SessionService } from '../auth/session.service';
import { TokenStorage } from '../auth/token-storage.service';
import { UiStateService } from '../services/ui-state.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(SnackbarService);
  const session = inject(SessionService);
  const tokenStorage = inject(TokenStorage);
  const ui = inject(UiStateService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint = req.url.endsWith('/login') || req.url.endsWith('/register');

      if (!isAuthEndpoint) {
        if (error.status === 401) {
          snackbar.warning('Session expirée ou non autorisée. Veuillez vous connecter.', 'Authentification');
          session.clear();
          tokenStorage.clear();
          router.navigate(['/']);
          ui.openAuthModal('login');
        } else if (error.status === 403) {
          const errorMessage = error.error?.message || 'Vous n\'avez pas la permission d\'effectuer cette action.';
          snackbar.error(errorMessage, 'Accès Refusé');
        } else if (error.status === 422) {
          if (error.error?.errors) {
            const firstKey = Object.keys(error.error.errors)[0];
            const errorMessage = error.error.errors[firstKey][0];
            snackbar.error(errorMessage, 'Erreur de validation');
          } else {
            const errorMessage = error.error?.message || 'Données fournies invalides.';
            snackbar.error(errorMessage, 'Erreur de validation');
          }
        } else if (error.status === 400 || error.status === 404 || error.status === 409) {
          const errorMessage = error.error?.message || 'Action impossible avec l\'état actuel du ticket ou du service.';
          snackbar.error(errorMessage, 'Erreur');
        } else if (error.status >= 500) {
          snackbar.error('Erreur serveur. Veuillez réessayer plus tard.', 'Erreur Serveur');
        } else if (error.status === 0) {
          snackbar.error('Impossible de joindre le serveur. Vérifiez votre connexion.', 'Connexion Impossible');
        }
      }

      return throwError(() => error);
    })
  );
};