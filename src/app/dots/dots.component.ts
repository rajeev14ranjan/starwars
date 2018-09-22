import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'dot',
  templateUrl: './dots.component.html',
  styleUrls: ['./dots.component.css']
})
export class DotsComponent implements OnInit, OnDestroy {
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() master = 0;
  @Input() isDotGun = false;
  @Output() outY = new EventEmitter<number>();

  @Input() down: boolean = true;
  public dotsId: any;

  constructor() { }

  ngOnInit() {
    if(!this.isDotGun)
    this.dotsId = setInterval(() => {
      if (this.down) {
        if(this.master != 2){
          this.y = this.y + 2;
          if (this.master == 1 && this.y % 50 == 0) {
            this.x += Math.random() > 0.5 ? 30 : -30;
          }
        }
      } else {
        this.y = this.y - 20;
      }
      this.outY.emit(this.y);
    }, 10);
  }

  ngOnDestroy() {
    if(!this.isDotGun)
    clearInterval(this.dotsId); 
  }
}
