import { Injectable } from '@angular/core';
import { User } from '../shared/user.model';
import { SharedService } from '../shared/shared.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  that: any;
  isLoggedIn: boolean;
  user: User;

  constructor(
    private _http: HttpClient,
    private _shared: SharedService
  ) {
    this.isLoggedIn = false;
  }



}
