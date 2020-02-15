import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { StorageService } from '../service/browser-storage.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FloatTextComponent } from '../float-text/float-text.component';
import { FeedbackComponent } from '../feedback/feedback.component';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements AfterViewInit {
  public isRegMode = false;
  public alertsIds = [];
  public validateForm: FormGroup;

  @ViewChild('floater') floater: FloatTextComponent;
  @ViewChild('feedback') feedback: FeedbackComponent;

  constructor(
    private _localStorage: StorageService,
    private _title: Title,
    private _router: Router,
    private fb: FormBuilder
  ) {
    this._title.setTitle('Login Page');
    this._localStorage.autoLoginIfTokenAvailable();
    this.antFormContructor(fb);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const aElt = document.querySelectorAll('a');
      for (let i = 0; i < aElt.length; i++) {
        if (aElt[i].title.includes('Hosted on free')) {
          aElt[i].remove();
          break;
        }
      }
    }, 100);

    this.alertsIds.push(
      setTimeout(() => {
        this.floater.showText('Sign Up if you are new to this Page 😊', 'I');
      }, 1500)
    );

    this.alertsIds.push(
      setTimeout(() => {
        this.floater.showText(`You can also login as a Guest 😃`, 'S');
      }, 5300)
    );
  }

  public clearPendingAlerts() {
    while (this.alertsIds.length) {
      const id = this.alertsIds.pop();
      clearTimeout(id);
    }
  }

  public login() {
    const fn = this.getFormValue('fullName');
    const un = this.getFormValue('userName');
    const pw = this.getFormValue('password');
    const rem = this.getFormValue('remember');
    if (this.isRegMode) {
      // Registration
      this._localStorage.saveCredentials(fn, un, pw).subscribe(
        (success: boolean) => {
          this.resetForm();
          this.setFormValue('password', '');
          this.setFormValue('userName', un);
          this.isRegMode = false;
          this.floater.showText('Please Login with credentials', 'S');
        },
        (error: string) => {
          this.floater.showText('SignUp Failed', 'E');
        }
      );
    } else {
      // Login
      this._localStorage.checkCredentialValidity(un, pw).subscribe(
        (response: boolean) => {
          if (response) {
            this._localStorage.uniquieLogid = this.getUniqueID();
            this._localStorage.saveUserLog();
            rem
              ? this._localStorage.saveAutoLoginToken(un, pw)
              : this._localStorage.deleteAutoLoginToken();
            this._router.navigateByUrl('dashboard');
          } else {
            this.setFormValue('password', '');
            this.floater.showText('Incorrect Username or Password', 'E');
          }
        },
        error => {
          this.floater.showText('Server Connection cannot be established', 'E');
        }
      );
    }
  }

  public getUniqueID(): string {
    return Date.now()
      .toString(36)
      .toUpperCase();
  }

  antFormContructor(fb) {
    this.validateForm = fb.group({
      fullName: ['', [Validators.required]],
      userName: [
        '',
        {
          validators: [Validators.required],
          asyncValidators: [this.userNameAsyncValidator],
          updateOn: 'blur'
        }
      ],
      password: ['', [Validators.required]],
      remember: [false, []]
    });
  }

  getFormValue(name) {
    return this.validateForm.controls[name].value;
  }

  setFormValue(name, value) {
    return this.validateForm.controls[name].setValue(value);
  }

  submitForm = ($event: any) => {
    $event.preventDefault();
    this.clearPendingAlerts();
    if (this.validateForm.valid) {
      this.login();
    } else {
      for (const key in this.validateForm.controls) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
      this.floater.showText('Complete all Fields', 'E');
    }
  };

  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  userNameAsyncValidator = (control: FormControl) => {
    this.clearPendingAlerts();
    const validationError = { error: true, duplicated: true };
    return this._localStorage
      .getFullUserNameValidity(this.getFormValue('userName'))
      .pipe(
        map((res: Array<any>) => {
          if (res && res.length) {
            this.floater.showText(
              this.isRegMode
                ? `This Username is NOT Available`
                : `Welcome ${res[0]['fullname']}`,
              this.isRegMode ? 'E' : 'S'
            );
            return this.isRegMode ? validationError : null;
          } else {
            this.floater.showText(
              this.isRegMode
                ? 'Username Available'
                : 'No User found, Sign-up if new User',
              this.isRegMode ? 'S' : 'E'
            );
            return this.isRegMode ? null : validationError;
          }
        }),
        catchError(error => {
          this.floater.showText("This site can't be reached", 'E');
          return of(validationError);
        })
      );
  };

  public loginAsGuest() {
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
    this._router.navigateByUrl('dashboard');
  }

  public feedbackThanks(isSuccess: boolean) {
    this.floater.showText('Thank you for your Valuable feedback', 'I');
  }
}
