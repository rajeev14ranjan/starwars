import { Component,ViewChild } from '@angular/core';
import { BrowserStorageService } from '../service/browser-storage.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FloatTextComponent } from '../float-text/float-text.component';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  public title = 'login-page';
  public un = '';
  public pw = '';
  public fn = '';
  public inprogress = false;
  public shwPass = false;
  public failureCnt = 0;
  public isRegMode = false;
  public isSignUpAllowed = true;
  public isUserNameValid = true;
  @ViewChild('loginForm') loginForm : NgForm;
  @ViewChild('floater') floater : FloatTextComponent;

  public errorMsg: any;

  constructor(private _localStorage: BrowserStorageService, private _title: Title, private _router: Router) {
    this.clearError();
    this._title.setTitle('Login Page');
  }

  public clearError() {
    this.errorMsg = [{
      "type": "",
      "msg": ""
    }]
  }

  public clear() {
    this.shwPass = false;
    this.clearError();
    this.loginForm.form.reset();
  }


  public verifyUserName() {
    let fullName = this._localStorage.getFullUserNameValidity(this.un);
    if (!fullName) {
      this.isSignUpAllowed = true;
      this.errorMsg[0].type = this.isRegMode ? 'S' : 'E';
      this.errorMsg[0].msg = this.isRegMode ? "Username Available" : "No User found, Sign-up if new User";
      this.isUserNameValid = !this.isRegMode;
    } else {
      this.isSignUpAllowed = false;
      this.errorMsg[0].type = this.isRegMode ? 'E' : 'S';
      this.errorMsg[0].msg = this.isRegMode ? `This Username is NOT Available` : `Welcome ${fullName}`;
      this.isUserNameValid = this.isRegMode;
    }

    this.floater.showText(this.errorMsg[0].msg,this.errorMsg[0].type);
  }

  public login() {
    if (this.isRegMode) {
      //SignUP
      this._localStorage.saveCredentials(this.fn, this.un, this.pw);
      this.pw = '';
      this.isRegMode = false;
      this.errorMsg[0].type = "S";
      this.errorMsg[0].msg = "SignUp Success. Please Login";
    } else {
      //Login
      if (this._localStorage.checkCredentialValidity(this.un, this.pw)) {
        this._router.navigateByUrl('game');
      } else {
        this.errorMsg[0].type = 'E';
        this.errorMsg[0].msg = 'Incorrect Username or Password';
        this.pw = '';
        
      }
    }
    this.floater.showText(this.errorMsg[0].msg, this.errorMsg[0].type);
  }



}
