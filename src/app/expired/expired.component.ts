import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expired',
  templateUrl: './expired.component.html',
  styleUrls: ['./expired.component.css']
})
export class ExpiredComponent implements OnInit {

  messages?: Array<string>;

  constructor(
    private _shared: SharedService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.messages = this._shared.getMessages();
    console.log(this.messages);
  }

  goToLoginPage() {
    this._router.navigate(['login']);
  }

}
