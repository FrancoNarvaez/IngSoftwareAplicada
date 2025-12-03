import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Convertir la promesa del token en un observable
  return from(authService.getToken()).pipe(
    switchMap(token => {
      // Si hay token, agregarlo al header
      if (token) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(cloned);
      }
      
      // Si no hay token, continuar sin modificar
      return next(req);
    })
  );
};
