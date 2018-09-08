import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BrowserStorageService ,UserDetail} from '../service/browser-storage.service';
import { Router } from '@angular/router';
import { PopUpProp, PopUpComponent } from '../pop-up/pop-up.component';
import { FloatTextComponent } from '../float-text/float-text.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public allUsers: Array<UserDetail>;
  public popUpProp : PopUpProp;
  public tempIndex : number;
  public count : number;
  public isAdmin :boolean;
  @ViewChild('newUserConfirmation') public newUserConfirmation : PopUpComponent;
  @ViewChild('floater') floater : FloatTextComponent;

  constructor(private _title: Title, private _localStorage: BrowserStorageService, private _router:Router) {
    this._localStorage.checkForLogin();
    
  }

  ngOnInit() {
    this.count=1;
    this.allUsers = this._localStorage.getAllUsers();
    this.isAdmin = this._localStorage.isAdmin();
    this._title.setTitle(this.isAdmin? 'Admin Page':'About Page');
  }

  public deleteUser() {
    this._localStorage.deleteUser(this.tempIndex);
    this.allUsers = this._localStorage.getAllUsers();
    this.floater.showText('User Successfully Deleted', 'S', 2000);
  }

  public deleteUserConfirmation(index:number){
    this.tempIndex = index;
    let confirmUser = new PopUpProp();
    confirmUser.header = 'Delete User';
    confirmUser.body = `Are you sure you want to delete ${this.allUsers[index].fullName} ?`;
    confirmUser.btnDanger = 'Delete';
    confirmUser.btnNeutral = 'Cancel';
    confirmUser.operation = 'delete';
    this.popUpProp = confirmUser;
    this.newUserConfirmation.show();
  }

  public goTo(url:string){
    this._router.navigateByUrl(url);
  }

  public isDelete(fn:string, un:string):boolean{
    return (un !='rr' || !fn.includes('Rajeev'));
  }

  public successCallBack(obj: any){
    if(this.popUpProp.operation == 'delete'){
      this.deleteUser();
    } else if(this.popUpProp.operation == 'create'){
      obj.res=='I' ? this.createDummyUser() : this.goTo('login');
    }
  }

  public createDummyUser(){
    this._localStorage.CreateDummyUser(4);
    this.allUsers = this._localStorage.getAllUsers();
    this.floater.showText('Dummy User Created Successfully', 'S', 2000);
  }

  
  public createUser(){
    if(this.allUsers.length > 7){
      this.floater.showText('Maximum allowed Users already created', 'E');
      return;
    }
    let confirmUser = new PopUpProp();
    confirmUser.header = 'Create New User';
    confirmUser.body = `<h5>Are you sure you want to create new User?</h5>
    <h6>You would be taken to Login page, Click on new user on Login page to create a user.
    <h6>Note : The user is created locally. Click on Create Dummy to create a dummy user with same User Name and Password</h6>`;
    confirmUser.btnSuccess = 'SignUp Page';
    confirmUser.btnNeutral = 'Cancel';
    confirmUser.btnInfo = 'Create Dummy'
    confirmUser.operation= 'create';
    this.popUpProp = confirmUser;
    this.newUserConfirmation.show();
  }

  public showTestNotification(){
    let n = this.count
    let t = n % 3 == 0 ? 'I' : n % 3 == 1 ?  'E' : 'S';
    this.floater.showText(this.count++ + '  Test Notification Received', t)
  }
  
}
