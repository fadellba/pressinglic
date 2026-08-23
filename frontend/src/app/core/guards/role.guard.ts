import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SessionService } from '../auth/session.service';
import { UiStateService } from '../services/ui-state.service';
import { SnackbarService } from '../../shared/components/ui/snackbar/snackbar.service';
import { UserRole } from '../models/enums';

//CanActivateFn permet de définir un guard fonctionnel
/*

                    Route protégée
                          ↓
                     roleGuard()
                          ↓
              expectedRole est fourni
                          ↓
              utilisateur authentifié ?
                    /             \
                  non             oui
                  ↓                 ↓
          restoreSession()      vérifier rôle
                  ↓                 ↓
             utilisateur ?      role === expectedRole
              /      \             /        \
            non      oui          oui        non
             ↓        ↓            ↓          ↓
       login modal  vérifier    return true  snackbar
                      rôle                    ↓
                                           redirection

            1. vérifier l'authentification
            2. restaurer la session si nécessaire
            3. vérifier le rôle
            4. autoriser ou refuser l'accès
*/

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