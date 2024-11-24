import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accounterService = inject(AccountService);
  if (accounterService.currentUser()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accounterService.currentUser()?.token}`,
      },
    });
  }
  return next(req);
};
