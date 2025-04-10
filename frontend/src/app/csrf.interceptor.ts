// src/app/csrf-interceptor.ts
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const csrfToken = this.getCookie('csrftoken');

    if (csrfToken && !['GET', 'HEAD'].includes(req.method)) {
      const cloned = req.clone({
        headers: req.headers.set('X-CSRFToken', csrfToken),
        withCredentials: true
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) return decodeURIComponent(value);
    }
    return null;
  }
}
