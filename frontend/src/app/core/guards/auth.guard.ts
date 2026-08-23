import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SessionService } from '../auth/session.service';
import { UiStateService } from '../services/ui-state.service';

//CanActivateFn permet de définir un guard fonctionnel, il dit si cette fonction doit décider si Angular peut accéder à la route.
/*

                    Utilisateur
                         ↓
                demande une route
                         ↓
                    authGuard
                         ↓
              session.isAuthenticated()
                    /          \
                  oui          non
                  ↓              ↓
             return true    restoreSession()
                                ↓
                           ┌────┴────┐
                         user       null
                          ↓           ↓
                    return true    openAuthModal()
                                      ↓
                                  login affiché
                                      ↓
                              return UrlTree(['/'])
                                      ↓
                                    "/"
                                      ↓
                           login réussi plus tard
                                      ↓
                               callback exécuté
                                      ↓
                           navigateByUrl(state.url)
                                      ↓
                             route demandée

*/
export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const session = inject(SessionService);
  const ui = inject(UiStateService);
  const router = inject(Router);

  if (session.isAuthenticated()) {
    return true;
  }

  const user = await auth.restoreSession();
  if (user) {
    return true;
  }

  ui.openAuthModal('login', () => {
    router.navigateByUrl(state.url);
  });

  return router.createUrlTree(['/']);
};

