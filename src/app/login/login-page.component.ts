import { Component,ViewChild, AfterViewInit } from '@angular/core';
import { StorageService } from '../service/browser-storage.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FloatTextComponent } from '../float-text/float-text.component';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements AfterViewInit {
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

  constructor(private _localStorage: StorageService, private _title: Title, private _router: Router) {
    this.clearError();
    this._title.setTitle('Login Page');
  }

  ngAfterViewInit(){
    setTimeout(()=> {
    let aElt = document.querySelectorAll('a');
    for(let i = 0; i < aElt.length ; i++){
      if(aElt[i].title.includes('Hosted on free')){
        aElt[i].remove();
        break;
      }
    }},100);

    setTimeout(() => {
      this.floater.showText('Sign Up if you are new to this Page 😊', 'I');
    }, 1500);

    setTimeout(() => {
      this.floater.showText(`You can also login as a Guest 😃`, 'S');
    }, 5300);
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
    this._localStorage.getFullUserNameValidity(this.un)
    .subscribe((res : Array<any>)=>{
        if(res && res.length > 0){
          let fullName = res[0]['fullname'];
          this.isSignUpAllowed = false;
          this.errorMsg[0].type = this.isRegMode ? 'E' : 'S';
          this.errorMsg[0].msg = this.isRegMode ? `This Username is NOT Available` : `Welcome ${fullName}`;
          this.isUserNameValid = this.isRegMode;
        } else {
          this.isSignUpAllowed = true;
          this.errorMsg[0].type = this.isRegMode ? 'S' : 'E';
          this.errorMsg[0].msg = this.isRegMode ? "Username Available" : "No User found, Sign-up if new User";
          this.isUserNameValid = !this.isRegMode;
        }
        this.floater.showText(this.errorMsg[0].msg,this.errorMsg[0].type);
      },
    (error)=>{
      this.floater.showText(error, 'E')
    });
  }

  public login() {
    if (this.isRegMode) {
      this._localStorage.getFullUserNameValidity(this.un)
      .subscribe((res : Array<any>)=>{
        if(res && res.length > 0){
          this.floater.showText('This Username is NOT Available','E');
          this.un = '';
          return;
        }else{
          //SignUP
          this._localStorage.saveCredentials(this.fn, this.un, this.pw);
          this.pw = '';
          this.isRegMode = false;
          this.errorMsg[0].type = "S";
          this.errorMsg[0].msg = "SignUp Success. Please Login";
        }
      });
    } else {
      //Login
      this._localStorage.checkCredentialValidity(this.un, this.pw).subscribe(
        (response : boolean)=> {
          if (response) {
            this._localStorage.uniquieLogid = this.getUniqueID();
            this._localStorage.saveUserLog();
            this._router.navigateByUrl('game');
          } else {
            this.pw = '';
            this.floater.showText('Incorrect Username or Password', 'E');
          }
        }, error => {this.floater.showText(error, 'E')});
    }
  }

  public getUniqueID(): string{
     return (Date.now()).toString(36).toUpperCase();
  }

  public loginAsGuest(){
    this._localStorage.loggedUserID = 'guest';
    this._localStorage.loggedUserName = 'Guest';
    this._localStorage.loggedUser.username = 'guest';
    this._localStorage.loggedUser.fullname = 'Guest';
    this._localStorage.loggedUser.userid = 2;
    this._localStorage.loggedUser.access = 'user';
    this._localStorage.loggedUser.data = 'User logged in as Guest';
    this._localStorage.isGuestUser = true;
    this._localStorage.uniquieLogid = this.getUniqueID();
    this._localStorage.saveUserLog();
    this._router.navigateByUrl('game');
  }
}
