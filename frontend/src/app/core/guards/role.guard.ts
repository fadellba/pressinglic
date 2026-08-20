import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SessionService } from '../auth/session.service';
import { UiStateService } from '../services/ui-state.service';
import { SnackbarService } from '../../shared/components/ui/snackbar/snackbar.service';
import { UserRole } from '../models/enums';

export const roleGuard = (expectedRole: UserRole): CanActivateFn => {
  return async () => {
    const auth = inject(AuthService);
    const session = inject(SessionService);
    const ui = inject(UiStateService);
    const router = inject(Router);
    const snackbar = inject(SnackbarService);

    if (!session.isAuthenticated()) {
      const user = await auth.restoreSession();
      if (!user) {
        ui.openAuthModal('login');
        return router.createUrlTree(['/']);
      }
    }

    if (session.user()?.role === expectedRole) {
      return true;
    }

    snackbar.error('Vous n\'avez pas la permission d\'accéder à cette section.', 'Accès non autorisé');
    return router.createUrlTree(['/']);
  };
};