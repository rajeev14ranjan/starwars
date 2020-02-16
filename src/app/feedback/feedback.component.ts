import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { StorageService } from '../service/browser-storage.service';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FeedbackComponent {
  @Output() done = new EventEmitter<boolean>();
  constructor(private _storageService: StorageService) {}
  public rating = 0;
  public feedback = '';
  public isModalVisible = false;
  public tooltips = [
    'I hated it',
    "I didn't like it",
    'It was okay',
    'I liked it',
    'I loved it'
  ];

  public show() {
    this.isModalVisible = true;
    this.reset();
  }

  public reset() {
    this.rating = 0;
    this.feedback = '';
  }

  public hide() {
    this.isModalVisible = false;
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
