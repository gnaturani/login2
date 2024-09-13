import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user.model';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';
import { Returnapi } from '../shared/returnapi.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  showSpinner = false;
  privacyText: string = "";

  constructor(
    public shared: SharedService,
    private _http: HttpClient,
    private _router: Router,
  ) { }

  ngOnInit() {
    if (this.shared.getUser().privacy_accepted === undefined) {
      this.setPrivacy(false);
    }
    this.privacyText = '...loading...';
    this.getPrivacyInfo();
    console.log(this.shared.getUser());
  }

  getPrivacyInfo() {

    const that = this;

    this._http.post<Returnapi>( this.shared.getBasePath() + '/api/impostazioni/recuperaImpostazioni.php',
                { chiave: 'privacy_iniziale'}
            ).subscribe(
            (val) => {
              console.log('POST call successful value returned in body',
              val);
                // console.log(val);
                if (val.success) {
                    console.log('privacy recuperata!');

                    const stringi = JSON.stringify(val.returnObject);
                    const settings = JSON.parse(stringi);
                    that.privacyText = settings[0].contenuto;

                } else {
                  try {

                  } catch (Err) {
                  }
                }
            },
            response => {
              console.log('POST call in error', response);
              return false;
            },
            () => {
            });

  }

  changeAccept(event: any) {
    console.log(event.checked);
    this.setPrivacy(event.checked);
    console.log('changeAccept:', this.shared.getUser().privacy_accepted);
  }

  setPrivacy(value: any) {
    const user = this.shared.getUser();
    user.privacy_accepted = value;
    this.shared.setUser(user);
  }

  savePrivacyAndGoOn() {
    const that = this;

    console.log('savePrivacyAndGoOn');
    this.showSpinner = true;

    this._http.post<Returnapi>( this.shared.getBasePath() + '/api/login/update.php',
                JSON.stringify(this.shared.getUser())
            ).subscribe(
            (val) => {
              console.log('POST call successful value returned in body',
              val);
                // console.log(val);
                if (val.success) {
                    console.log('utente salvato!');
                    this.shared.setUserObj(JSON.stringify(val.returnObject));
                    this._router.navigate(['home']);

                } else {
                  that.shared.setMessages(val.returnMessages);

                  try {

                  } catch (Err) {

                  }

                }
            },
            response => {
              console.log('POST call in error', response);
              that.shared.setMessages(response);
              return false;
            },
            () => {
            });

  }

  startLogoutDialog(): void {
    const confirmLogout = window.confirm('Eseguire il logout?');
    console.log(confirmLogout);
    if (confirmLogout) {
      this.shared.executeLogout();
    }
  }

  goToHome() {
    this._router.navigate(['home']);
  }

}


