import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../service/browser-storage.service';
import { RoutingService } from '../service/routing-service.service';
import { FloatTextComponent } from '../float-text/float-text.component';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  public isUserAdmin : boolean;
  public isGuestUser : boolean;

  @ViewChild('floater') floater : FloatTextComponent;
  @ViewChild('feedbackModal') feedbackModal : ModalDirective; 

  constructor(private _title : Title, private _localStorage: StorageService , private _routinService : RoutingService, private _router: Router) {
    this._title.setTitle('Dash Board');
    this._localStorage.checkForLogin();
   }

  ngOnInit() {
    this.isUserAdmin = this._localStorage.isAdmin();
    this.isGuestUser = this._localStorage.isGuestUser;
    if(!this.isUserAdmin){
    setTimeout(() => {
      this.floater.showText('↑ click on About tab to know more about this Project', 'I');
    }, 2000);}
  }

  public goTo(url:string){
    this._router.navigateByUrl(url);
  }

  public feedbackThanks(isSuccess: boolean){
    this.floater.showText('Thank you for your Valuable feedback','I');
}

}
