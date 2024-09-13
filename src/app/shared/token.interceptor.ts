import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { SharedService } from './shared.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private _shared: SharedService
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('token interceptor');
    // console.log('token:', this._shared.getToken());
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this._shared.getToken()}`,
        'CustomAuthorization': `Bearer ${this._shared.getToken()}`
      }
    });
    return next.handle(request);
  }
}
