import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class BrowserStorageService {
  private userListKey = 'userListKey';
  private highScoreKey = 'highScoreKey';
  private allUsers: Array<UserDetail>;
  public loggedUserName: string;
  public loggedUserID: string;

  constructor(private _router : Router){}

  public getAllUsers(): Array<UserDetail> {
      const allUserStr = localStorage.getItem(this.userListKey);
      if (allUserStr) {
          return JSON.parse(allUserStr);
      } else {
          return new Array<UserDetail>();
      }
  }

  public getHighScore(){
      let h = localStorage.getItem(this.highScoreKey);
      return h? JSON.parse(h): { user : 'SYSYEM', highScore  : 0 };
  }

  public saveHighScore(score : number){
        let highScoreUser = this.loggedUserName || 'SYSTEM';
        let newHighScore = { user : highScoreUser, highScore  : score}
        localStorage.setItem(this.highScoreKey, JSON.stringify(newHighScore));
  }

  public checkForLogin(){
      if(!this.loggedUserName){
        this._router.navigateByUrl('login');
      }
  }

  public isAdmin(): boolean{
    return (this.loggedUserID == 'rr' && this.loggedUserName.includes('Rajeev'));
  }

  public getFullUserNameValidity(checkUserName: string): string {
      let allUsers = this.getAllUsers();
      if (allUsers.length > 0) {
          let user = allUsers.find(user => user.userName === checkUserName);
          return user? user.fullName : null;
      } else {
          return null;
      }
  }

  public saveCredentials(fullName: string, userName: string, passWord: string) {
      let passKey = this.hash(passWord);
      let allUsers = this.getAllUsers();
      let newUserDetail = new UserDetail(fullName, userName, passKey);
      allUsers.push(newUserDetail);
      localStorage.setItem(this.userListKey, JSON.stringify(allUsers));
  }

  public checkCredentialValidity(checkUserName: string, checkPassWord: string): boolean {
      let allUsers = this.getAllUsers();
      if (allUsers.length > 0) {
          let successUser = allUsers.find(user => user.userName === checkUserName);
          if(successUser){
          this.loggedUserName = successUser.fullName;
          this.loggedUserID = successUser.userName;
          return (successUser.passKey === this.hash(checkPassWord));
          } else {
              this.loggedUserName = '';
              return false;
          }
      } else {
          this.loggedUserName = '';
          return false;
      }
  }

  public deleteUser(index: number) {
      let allUsers = this.getAllUsers();
      if (index < allUsers.length) {
          allUsers.splice(index, 1);
          localStorage.setItem(this.userListKey, JSON.stringify(allUsers));
      }

  }

  public hash(passText: string) {
      /* Simple hash function. */
      var a = 1, c = 0, iterator, o;
      if (passText) {
          a = 0;
          /*jshint plusplus:false bitwise:false*/
          for (iterator = passText.length - 1; iterator >= 0; iterator--) {
              o = passText.charCodeAt(iterator);
              a = (a << 6 & 268435455) + o + (o << 14);
              c = a & 266338304;
              a = c !== 0 ? a ^ c >> 21 : a;
          }
      }
      return a.toString(36);
  }

  public CreateDummyUser(userlenth : number){
    
    let valid, fn,un,ps ='';
      do{
            fn = '';
            for(let i = 0; i < 2*userlenth; i++){
                fn += this.randomLetter(i==0 || i== userlenth) + (i== userlenth-1? ' ':'');
            }
            un = fn.split(' ')[0][0] + fn.split(' ')[1][0];
            un = un.toLowerCase();
            ps = un;
            valid = this.getFullUserNameValidity(un);
        } while(valid || un == 'rr');
        this.saveCredentials(fn,un,ps);
  }

  public randomLetter(isCaptial = false){
      return String.fromCharCode(Math.floor(Math.random() * 26) + (isCaptial ? 65: 97));
  }
}

export class UserDetail {
  constructor(
      public fullName?: string,
      public userName?: string,
      public passKey?: string
  ) { }
}
