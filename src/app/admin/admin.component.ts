import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { StorageService ,UserDetail, Logs, Feedback} from '../service/browser-storage.service';
import { Router } from '@angular/router';
import { PopUpProp, PopUpComponent } from '../pop-up/pop-up.component';
import { FloatTextComponent } from '../float-text/float-text.component';
import { HttpHelperService } from '../service/http-helper.service';
import { ModalDirective } from 'ngx-bootstrap';
import { FeedbackComponent } from '../feedback/feedback.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public allUsers: Array<UserDetail>;
  public userLogs: Array<Logs>;
  public feedbacks: Array<Feedback>;
  public popUpProp : PopUpProp;
  public tempUser : UserDetail;
  public count : number;
  public isAdmin :boolean;
  public isGuestUser : boolean;
  public loggedUserID : number;
  public currentUserName : string;

  @ViewChild('newUserConfirmation') public newUserConfirmation : PopUpComponent;
  @ViewChild('floater') floater : FloatTextComponent;
  @ViewChild('feedback') feedback : FeedbackComponent;
  @ViewChild('logModal') logModal : ModalDirective; 
  @ViewChild('feedbackModal') feedbackModal : ModalDirective; 

  public testURL='./';
  public postData = `{"un":"nid","fn":"nidhi bhade","pw":"love"}`;
  public testResponse = '';
  public isPost = false;

  constructor(private _title: Title, private _localStorage: StorageService, private _router:Router, private _httpHelper : HttpHelperService) {
    this._localStorage.checkForLogin();   
  }

  ngOnInit() {
    this.count=1;
    this.isAdmin = this._localStorage.isAdmin();
    this.isGuestUser = this._localStorage.isGuestUser;
    this.loggedUserID = this._localStorage.loggedUser.userid;
    if(this.isAdmin){
      this.fetchAllUser();
    }
    this._title.setTitle(this.isAdmin? 'Admin Page':'About Page');
  }

  public fetchAllUser(){
    this._localStorage.getAllUsers()
    .subscribe(res => {
        this.allUsers = res;
      },error => this.floater.showText(error,'E'));
    }

  public deleteUser() {
    this._localStorage.deleteUser(this.tempUser.userid, this.tempUser.username).subscribe(
      res=> {
        if(res.status){
          this.fetchAllUser();
        }
        this.floater.showText(res.status_message, res.status?'S':'E', 2000);
      }
    )    
  }

  public deleteUserConfirmation(user: UserDetail){
    this.tempUser = user;
    let confirmUser = new PopUpProp();
    confirmUser.header = user.userid > 2 ? `Delete User`: 'Clear all Logs';
    confirmUser.body = user.userid > 2 ? `${user.fullname} will no longer be able to login. This will also delete their log history. Do you want to delete ?` : `This will all log history of ${user.fullname}. Do you want to clear ?`;
    confirmUser.btnDanger = user.userid > 2 ?`Delete ${user.fullname}`:`Clear All Logs`;
    confirmUser.btnNeutral = 'Cancel';
    confirmUser.operation = 'delete';
    this.popUpProp = confirmUser;
    this.newUserConfirmation.show();
  }

  public goTo(url:string){
    this._router.navigateByUrl(url);
  }

  public isDelete(user: UserDetail):boolean{
    return (user.access =='user');
  }

  public successCallBack(obj: any){
    if(this.popUpProp.operation == 'delete'){
      this.deleteUser();
    } else if(this.popUpProp.operation == 'create'){
      obj.res=='I' ? this.createDummyUser() : this.goTo('login');
    }
  }

  public createDummyUser(){
    this._localStorage.CreateDummyUser(5).subscribe(res=>{
      if(res){
        this.floater.showText('Dummy User Created Successfully', 'I', 2000);
        this.fetchAllUser();
      }else{
        this.floater.showText(`Dummy User creation failed`, 'E', 2000);
      }
    })
    
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
  

  public testConnection(){
    if(!this.testURL.startsWith('./') && !this.testURL.startsWith('http')) {this.testURL=='./' + this.testURL;}

    let dataP = '';
    try{
      dataP = JSON.parse(this.postData);
    } catch(e){
      this.floater.showText(e,'E');
      return;
    }

    if(this.isPost){
      this._httpHelper.post(this.testURL, dataP).subscribe(res=>{
        this.testResponse = res;
        this.floater.showText("Sucess",'S');
      },(error:string)=>{
        this.testResponse = error;
        this.floater.showText("Error Occurred",'E');
      });
    } else {
      
      this._httpHelper.get(this.testURL).subscribe(res=>{
        this.testResponse = res;
        this.floater.showText("Sucess",'S');
      },(error:string)=>{
        this.testResponse = error;
        this.floater.showText("Error Occurred",'E');
      });

    }

    
  }

  public openLogModal(userId : number){
    this.currentUserName = this.allUsers? this.allUsers.find(x=> x.userid == userId).fullname:'you';
    this._localStorage.getLogforUser(userId).subscribe(
      (logs:Array<Logs>)=>{
        if(logs && logs.length > 0){
           this.userLogs = logs;
          this.logModal.show();
        } else {
          this.floater.showText(`No logs available for ${this.currentUserName}`,'I');
        }
      },(error:string)=>{this.floater.showText(error,'E')});
  }

  public openFeedbackModal(userId : number){
    this.currentUserName = this.allUsers? this.allUsers.find(x=> x.userid == userId).fullname:'';
    this._localStorage.getFeedback(userId).subscribe(
      (feedbacks:Array<Feedback>)=>{
        if(feedbacks && feedbacks.length > 0){
          this.feedbacks = feedbacks;
          this.feedbackModal.show();
       } else {
         this.floater.showText(`No feedback available from ${this.currentUserName}`,'I');
       }
     },(error:string)=>{this.floater.showText(error,'E')});
  }

  public feedbackThanks(isSuccess: boolean){
      this.floater.showText('Thank you for your Valuable feedback','I');
  }

}
