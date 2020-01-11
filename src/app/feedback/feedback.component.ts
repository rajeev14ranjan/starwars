import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { StorageService } from '../service/browser-storage.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  @Output() done = new EventEmitter<boolean>();
  @ViewChild('feedbackModal') feedbackModal: ModalDirective;
  constructor(private _storageService: StorageService) {}
  public max = 5;
  public rating = 0;
  public isReadonly = false;
  public feedback = '';
  public default = 'Please rate your overall experience';
  public status = this.default;
  public hoverStar = 0;

  public getStatus(star) {
    this.hoverStar = star;
    switch (star) {
      case 0:
        this.status = this.default;
        break;
      case 1:
        this.status = 'I hated it';
        break;
      case 2:
        this.status = "I didn't like it";
        break;
      case 3:
        this.status = 'It was okay';
        break;
      case 4:
        this.status = 'I liked it';
        break;
      case 5:
        this.status = 'I loved it';
        break;
    }
  }

  public show() {
    this.feedbackModal.show();
    this.reset();
  }

  public reset() {
    this.rating = 0;
    this.isReadonly = false;
    this.feedback = '';
    this.status = this.default;
    this.hoverStar = 0;
  }

  public hide() {
    this.feedbackModal.hide();
  }

  public postFeedback() {
    this._storageService.saveFeedback(this.rating, this.feedback).subscribe(
      ans => {
        this.hide();
        this.done.emit(true);
      },
      error => {
        this.hide();
      }
    );
  }
}
