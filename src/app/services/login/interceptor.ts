import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { API_PATH } from '../../models/environment/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    let cloned = req;
    if (token) {
      cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          console.log(refreshToken)
          if (refreshToken) {
            return this.http.post(`${API_PATH}/auth/refresh`, { refreshToken }, {
              headers: { 'Content-Type': 'application/json' }
            }).pipe(
              switchMap((res: any) => {
                localStorage.setItem('token', res.token);
                localStorage.setItem('refreshToken', res.refreshToken);

                // refaz a requisição original com o novo token
                const newReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${res.token}` }
                });
                return next.handle(newReq);
              })
            );
          }
        }
        return throwError(() => error);
      })
    );
  }
}
