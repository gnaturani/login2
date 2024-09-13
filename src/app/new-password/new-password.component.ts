import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { Returnapi } from '../shared/returnapi.model';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private _router: Router,
    private _shared: SharedService
  ) { }

  returnUrl?: string;
  loginError?: string;
  signupError?: string;
  signupMessage?: string;
  username?: string;
  password?: string;
  password2?: string;
  showSpinnerLogin?: boolean;
  showSpinnerSignup?: boolean;
  displayRegButton?: boolean;

  ngOnInit() {
    this.showSpinnerLogin = false;
    this.showSpinnerSignup = false;
    this.displayRegButton = true;
    this.signupError = '';
    this.signupMessage = '';
    this.loginError = '';

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    const encEmail = this.route.snapshot.queryParams['username'] || '';
    // console.log('encEmail: ', encEmail);
    this.username = this.decrypt(encEmail, 'chebeeeeeelllooo');
    // console.log('username: ', this.username);
    // console.log('returnUrl:', this.returnUrl);
    this.password = '';
    this.password2 = '';
  }

  get encryptMethodLength() {
    // tslint:disable-next-line:prefer-const
    const encryptMethod = this.encryptMethod;
    // get only number from string.
    // @link https://stackoverflow.com/a/10003709/128761 Reference.
    const aesNumber = encryptMethod.match(/\d+/)![0];
    // tslint:disable-next-line:radix
    return parseInt(aesNumber);
  }// encryptMethodLength

  get encryptKeySize() {
    const aesNumber = this.encryptMethodLength;
    // tslint:disable-next-line:radix
    return parseInt((aesNumber / 8).toString());
  }// encryptKeySize


  get encryptMethod() {
    return 'AES-256-CBC';
  }// encryptMethod


  decrypt(encryptedString: any, key: any) {
    const json = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedString)));

    const salt = CryptoJS.enc.Hex.parse(json.salt);
    const iv = CryptoJS.enc.Hex.parse(json.iv);

    const encrypted = json.ciphertext; // no need to base64 decode.

    // tslint:disable-next-line:radix
    let iterations = parseInt(json.iterations);
    if (iterations <= 0) {
      iterations = 999;
    }
    const encryptMethodLength = (this.encryptMethodLength / 4); // example: AES number is 256 / 4 = 64
    // tslint:disable-next-line:max-line-length
    const hashKey = CryptoJS.PBKDF2(key, salt, { 'hasher': CryptoJS.algo.SHA512, 'keySize': (encryptMethodLength / 8), 'iterations': iterations });

    const decrypted = CryptoJS.AES.decrypt(encrypted, hashKey, { 'mode': CryptoJS.mode.CBC, 'iv': iv });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }// decrypt

  public startSaveNewPassword() {

    this.signupMessage = '';
    this.signupError = '';
    this.loginError = '';
    this.showSpinnerLogin = true;

    const that = this;

    const params = {
      'username': this.username,
      'password': this.password
    };
    // console.log('params:', params);

    this._http.post<Returnapi>(this._shared.getBasePath() + '/api/login/saveNewPassword.php',
      params
    )
      .subscribe(
        (val) => {
          console.log('POST call successful value returned in body',
            val);
          console.log(val);
          if (val.success) {
            console.log('save and go to home!');
            window.location.href = that.returnUrl!;
          } else {
            that.loginError = val.returnMessages![0];
          }
          that.showSpinnerLogin = false;
        },
        response => {
          console.log('POST call in error', response);
          try {
            that.loginError = response.error[0];
          } catch (Err) {
            that.loginError = 'Nessuna risposta dal server';
          }
          that.showSpinnerLogin = false;
        },
        () => {
          console.log('The POST observable is now completed.');
          that.showSpinnerLogin = false;
        });
  }

}
