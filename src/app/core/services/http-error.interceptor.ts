import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpEvent } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>) => {
  return next(req).pipe(
    retry(1),
    catchError((error: HttpErrorResponse) => {
      console.error(`[HTTP Error] ${error.status}: ${error.message}`);
      return throwError(() => error);
    })
  );
};