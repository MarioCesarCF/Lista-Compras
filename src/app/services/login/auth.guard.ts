import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true; // deixa entrar
  } else {
    router.navigate(['/login']); // redireciona se não tiver login
    return false;
  }
};
