import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { Returnapi } from '../shared/returnapi.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _shared: SharedService
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      console.log('isLoggedIn', localStorage.getItem('isLoggedIn'));

      if (localStorage.getItem('isLoggedIn') === 'true') {

        const that = this;
        const authenticated = this._http.post<Returnapi>( this._shared.getBasePath() + '/api/login/checkSession.php', {}
            );
        const subject = new Subject<boolean>();
        authenticated.subscribe(
            (val) => {
              console.log('POST call successful value returned in body',
              val);
                console.log(val);
                if (val.success) {
                  console.log('continue!');
                  subject.next(true);
                } else {
                  that._shared.setMessages(val.returnMessages);
                  that._router.navigate(['expired']);
                  return false;
                }
            },
            response => {
              console.log('POST call in error', response);
              that._shared.setMessages(response);
              that._router.navigate(['expired']);
              return false;
            },
            () => {
            });
            return subject.asObservable();

      } else {
        this._router.navigate(['login']);
        return false;
      }
  }


}
