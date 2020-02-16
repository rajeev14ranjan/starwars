import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../service/browser-storage.service';
import { UserDetail, Logs, Feedback } from '../model/app.model';
import { Router } from '@angular/router';
import { PopUpProp, PopUpComponent } from '../pop-up/pop-up.component';
import { FloatTextComponent } from '../float-text/float-text.component';
import { ModalDirective } from 'ngx-bootstrap';
import { FeedbackComponent } from '../feedback/feedback.component';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public userLogs: Array<Logs>;
  public feedbacks: Array<Feedback>;
  public popUpProp: PopUpProp;
  public tempUser: UserDetail;
  public count: number;
  public isAdmin: boolean;
  public isGuestUser: boolean;
  public loggedUserID: number;
  public currentUserName: string;

  @ViewChild('newUserConfirmation') public newUserConfirmation: PopUpComponent;
  @ViewChild('floater') floater: FloatTextComponent;
  @ViewChild('feedback') feedback: FeedbackComponent;
  @ViewChild('logModal') logModal: ModalDirective;

  constructor(
    private _title: Title,
    private _localStorage: StorageService,
    private _router: Router
  ) {
    this._localStorage.checkForLogin();
  }

  ngOnInit() {
    this.count = 1;
    this.isGuestUser = this._localStorage.isGuestUser;
    this.loggedUserID = this._localStorage.loggedUser.userid;
    this.linkedInBadge();
    this._title.setTitle('About Page');
  }

  public linkedInBadge() {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; ++i) {
      if (
        scripts[i].getAttribute('src') &&
        scripts[i].getAttribute('src').includes('platform.linkedin.com')
      ) {
        scripts[i].remove();
      }
    }

    const linkedInScripts =
      'https://platform.linkedin.com/badges/js/profile.js';
    const node = document.createElement('script');
    node.src = linkedInScripts;
    node.type = 'text/javascript';
    node.async = false;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  public goTo(url: string) {
    this._router.navigateByUrl(url);
  }

  public openLogModal(userId: number) {
    this._localStorage.getLogforUser(userId).subscribe(
      (logs: Array<Logs>) => {
        if (logs && logs.length > 0) {
          this.userLogs = logs;
          this.logModal.show();
        } else {
          this.floater.showText(`No logs available for You`, 'I');
        }
      },
      (error: string) => {
        this.floater.showText(error, 'E');
      }
    );
  }

  public feedbackThanks(isSuccess: boolean) {
    this.floater.showText('Thank you for your Valuable feedback', 'I');
  }
}
