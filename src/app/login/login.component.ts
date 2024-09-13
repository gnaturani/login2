import { Component, Input, OnInit } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService } from "@abacritt/angularx-social-login";
import { SocialUser } from "@abacritt/angularx-social-login";
import { HttpClient } from '@angular/common/http';
import { Returnapi } from '../shared/returnapi.model';
import { SharedService } from '../shared/shared.service';
import { Router, ActivatedRoute, UrlTree } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';
import { map } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  googleUser: SocialUser | undefined;
  GoogleLoginProvider = GoogleLoginProvider;
  loggedIn: boolean = false;

  private accessToken = '';

  @Input() returnUrl?: string;
  gruppo?: string;
  loginError?: string;
  signupError?: string;
  signupMessage?: string;
  username?: string;
  password?: string;
  password_c?: string;
  showSpinnerLogin?: boolean;
  showSpinnerSignup?: boolean;
  displayRegButton?: boolean;

  constructor(
    private readonly _authService: SocialAuthService,
    private route: ActivatedRoute,
    private _http: HttpClient,
    private _router: Router,
    private _shared: SharedService
    ) {}

  ngOnInit() {

    console.log('Input() returnUrl:', this.returnUrl);

    this.showSpinnerLogin = false;
    this.showSpinnerSignup = false;
    this.displayRegButton = true;
    this.signupError = '';
    this.signupMessage = '';
    this.loginError = '';

    this.returnUrl = this.route.snapshot.paramMap.get('returnUrl') || "/";
    console.log("returnUrl", this.returnUrl);

    if (this.returnUrl == "/" || this.returnUrl == undefined){
      var paramString = window.location.href.split("?")[1];
      var params = paramString.split("&");
      params.forEach(param => {
        var complete = param.split("=");
        var paramName = complete[0];
        var paramValue = complete[1];
        if(paramName == "returnUrl") {
          this.returnUrl = paramValue;
          console.log("returnUrl", this.returnUrl);
        }
      });
    }

    this.gruppo = this.route.snapshot.queryParams['gruppo'] || 'carpaneto';
    console.log('gruppo:', this.gruppo);

    this._authService.authState.subscribe((user) => {
      this.googleUser = user;
      console.log("google user", this.googleUser);
      localStorage.setItem('google_user',JSON.stringify(this.googleUser));

      this.startLoginGoogle(this.googleUser.idToken);
    });

  }

  signOut(): void {
    this._authService.signOut();
  }

  refreshToken(): void {
    this._authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  getAccessToken(): void {
    this._authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => this.accessToken = accessToken);
  }

  public startLoginGoogle(id_token: string) {

    this.signupMessage = '';
    this.signupError = '';
    this.loginError = '';
    this.showSpinnerLogin = true;

    const that = this;
    const params = {
      'id_token': id_token,
      'gruppo': this.gruppo
    };
    // console.log('params:', params);

    this._http.post<Returnapi>( this._shared.getBasePath() + '/api/login/loginForGoogleUser.php',
          params
        )
      .subscribe(
        (val) => {
          // console.log('POST call successful value returned in body', val);
            // console.log(val);
            if (val.success) {
              // console.log('save and go to home!');
              that._shared.setUser(val.returnObject);
              const userS = JSON.stringify(val.returnObject);
              // console.log(userS);
              const user = JSON.parse(userS);
              // console.log(user);
              const token = user.token;
              console.log("return to:", that.returnUrl + '?token=' + token);
              window.location.href = that.returnUrl + '?token=' + token;

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


  public startLogin() {

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

    this._http.post<Returnapi>( this._shared.getBasePath() + '/api/login/login.php',
          params
        )
      .subscribe(
        (val) => {
          console.log('POST call successful value returned in body',
          val);
            console.log(val);
            if (val.success) {
              console.log('save and go to home!');
              that._shared.setUser(val.returnObject);
              const userS = JSON.stringify(val.returnObject);
              console.log(userS);
              const user = JSON.parse(userS);
              console.log(user);
              const token = user.token;
              window.location.href = that.returnUrl + '?token=' + token;
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


  public startSignUp() {

    this.signupError = '';
    this.signupMessage = '';
    this.loginError = '';

    console.log('password:', this.password);
    if (this.password === '' || this.password === undefined) {
      this.signupError = 'Inserire la password';
      return;
    }

    this.showSpinnerSignup = true;

    const that = this;

    const params = {
      'username': this.username,
      'password': this.password,
      'gruppo': this.gruppo
    };

    this._http.post<Returnapi>(this._shared.getBasePath() + '/api/login/signup.php',
          params
        )
      .subscribe(
        (val) => {
          console.log('POST call successful value returned in body',
            val);
            if (val.success) {
              that.signupMessage = val.returnMessages![0];
              that.displayRegButton = false;
            } else {
              that.signupError = val.returnMessages![0];
            }
            that.showSpinnerSignup = false;
        },
        response => {
          console.log('POST call in error', response);
          try {
            that.signupError = response.error[0];
          } catch (Err) {
            that.signupError = 'Nessuna risposta dal server';
          }
          that.showSpinnerSignup = false;
        },
        () => {
          console.log('The POST observable is now completed.');
          that.showSpinnerSignup = false;
        });
  }

  public startRememberPwd() {

    this.signupError = '';
    this.signupMessage = '';
    this.loginError = '';

    if (this.username === '' || this.username === undefined) {
      this.signupError = 'Inserire la mail';
      this.loginError = 'Inserire la mail';
      return;
    }

    this.showSpinnerSignup = true;
    this.showSpinnerLogin = true;

    const that = this;

    const params = {
      'username': this.username
    };

    this._http.post<Returnapi>(this._shared.getBasePath() + '/api/login/startResetPassword.php',
          params
        )
      .subscribe(
        (val) => {
          console.log('POST call successful value returned in body',
            val);
            if (val.success) {
              that.signupMessage = val.returnMessages![0];
              that.displayRegButton = false;
            } else {
              that.signupError = val.returnMessages![0];
              that.loginError = val.returnMessages![0];
            }
            that.showSpinnerSignup = false;
            that.showSpinnerLogin = false;
        },
        response => {
          console.log('POST call in error', response);
          try {
            that.signupError = response.error[0];
            that.loginError = response.error[0];
          } catch (Err) {
            that.signupError = 'Nessuna risposta dal server';
            that.loginError = 'Nessuna risposta dal server';
          }
          that.showSpinnerSignup = false;
          that.showSpinnerLogin = false;
        },
        () => {
          console.log('The POST observable is now completed.');
          that.showSpinnerSignup = false;
          that.showSpinnerLogin = false;
        });

  }

  public switchToRegistration(tabGroup: MatTabGroup) {
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;

    const tabCount = tabGroup._tabs.length;
    tabGroup.selectedIndex = 1;
  }

  public startLogout() {

  }

  public resetRegData() {
    this.displayRegButton = true;
    this.username = '';
    this.password = '';
    this.signupError = '';
    this.signupMessage = '';
  }

}
