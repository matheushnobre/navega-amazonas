import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../core/services/token-service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getToken();

  if(!token){
    return router.parseUrl('/login');
  }

  if(!tokenService.isTokenValid()){
    tokenService.logout();
    return router.parseUrl('/login');
  }
  return true;
};
