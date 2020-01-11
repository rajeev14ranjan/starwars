import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {
  @Input() popUpProp: PopUpProp;
  @Output() onClicked = new EventEmitter<any>();
  @ViewChild('popUpModal') popUpModal: ModalDirective;
  public data: string;

  constructor() {}

  ngOnInit() {}

  public show() {
    this.popUpModal.show();
  }

  public hide() {
    this.popUpModal.hide();
  }

  public clicked(res: string) {
    if (this.popUpProp.autoClose) {
      this.popUpModal.hide();
    }
    if (res !== 'N') {
      this.onClicked.emit({ res: res, data: this.data });
    }
  }
}
export class PopUpProp {
  constructor(
    public header = 'Alert',
    public body = 'The body of this modal is not initialized',
    public btnSuccess?: string,
    public btnDanger?: string,
    public btnInfo?: string,
    public btnNeutral = 'Close',
    public autoClose = true,
    public size = 'md',
    public operation?: string
  ) {}
}
