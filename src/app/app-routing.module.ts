import { NgModule } from '@angular/core';
import { RouterModule, Routes, withComponentInputBinding } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { bootstrapApplication } from '@angular/platform-browser';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path : '', component : LoginComponent },
  /*
  { path: 'new-password', component: NewPasswordComponent },
  { path: 'logout', component: LogoutComponent },
  */
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

