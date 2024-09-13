import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public username?: string;
  public message?: string;
  public messages?: Array<string>;
  public user?: User;
  private _token?: string;

  constructor(
    private _router: Router
  ) { }

  public setToken(token: any) {
    this._token = token;
    localStorage.setItem('token', this._token!);
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  public setMessage(token:any) {
    this.message = token;
    localStorage.setItem('message', this.message!);
  }

  public getMessage() {
    return localStorage.getItem('message');
  }

  public setMessages(token: any) {
    this.messages = token;
    localStorage.setItem('messages', JSON.stringify(this.messages));
  }

  public getMessages() {
    return JSON.parse(localStorage.getItem('messages')!);
  }

  public setUser(user: any) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(this.user));
    localStorage.setItem('isLoggedIn', 'true');
    this.setToken(this.user?.token);
  }

  public setUserObj(user: any) {
    this.user = JSON.parse(user);
    console.log(this.user);
    localStorage.setItem('user', JSON.stringify(this.user));
    if (this.user!.token !== null && this.user!.token !== undefined && this.user!.token !== '') {
      console.log('Token updated!');
      this.setToken(this.user!.token);
    }
  }

  public getUser() {
    // console.log(JSON.parse(localStorage.getItem('user')));
    return JSON.parse(localStorage.getItem('user')!);
  }

  public executeLogout() {
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    localStorage.setItem('isLoggedIn', 'false');
    this._router.navigate(['login']);
  }

  public getBasePath() {
    let basePath = '';
    if (window.location.hostname === 'localhost') {
        basePath = 'http://localhost:8888';
    } else {
        basePath = 'http://www.parrocchiacarpaneto.com/servizi';
        console.log('window.location.protocol: ' + window.location.protocol);
        if (window.location.protocol === 'https:' ) {
            basePath = 'https://www.parrocchiacarpaneto.com/servizi';
        }
    }
    return basePath;
  }


}
