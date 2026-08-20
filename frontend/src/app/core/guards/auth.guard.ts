import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SessionService } from '../auth/session.service';
import { UiStateService } from '../services/ui-state.service';

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