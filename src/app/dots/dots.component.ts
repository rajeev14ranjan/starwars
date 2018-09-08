import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'dot',
  templateUrl: './dots.component.html',
  styleUrls: ['./dots.component.css']
})
export class DotsComponent implements OnInit, OnDestroy {
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() master = false;
  @Output() outY = new EventEmitter<number>();

  @Input() down: boolean = true;
  public dotsId: any;

  constructor() { }

  ngOnInit() {
    this.dotsId = setInterval(() => {
      if (this.down) {
        if (this.y < 670) {
          this.y = this.y + 2;
          if (this.master && this.y % 50 == 0) {
            this.x += Math.random() > 0.5 ? 30 : -30;
          }
        } else {

        }
      } else {
        if (this.master && this.y > -200) {
          this.x += Math.random() > 0.5? 10: -10;
        }
        this.y = this.y > -200 ? this.y - 15 : this.y;

      }
      this.outY.emit(this.y);
    }, 10);
  }

  ngOnDestroy() {
    clearInterval(this.dotsId);
  }
}
