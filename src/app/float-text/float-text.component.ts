import { Component, OnInit } from '@angular/core';
import {
  state,
  trigger,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'float-text',
  template: `
    <div
      [@float]="view"
      class="floater"
      [ngClass]="type == 'E' ? 'error' : type == 'S' ? 'success' : 'info'"
    >
      <div class="text">
        {{ text }}
      </div>
    </div>
  `,
  styleUrls: ['./float-text.component.css'],
  animations: [
    trigger('float', [
      state(
        'in',
        style({
          opacity: '0.9',
          filter: 'blur(0px)'
        })
      ),
      state(
        'out',
        style({
          opacity: '0',
          filter: 'blur(10px)'
        })
      ),

      transition('out => in', animate('500ms ease-in')),
      transition('in => out', animate('300ms ease-out'))
    ])
  ]
})
export class FloatTextComponent implements OnInit {
  public text = '';
  public type = 'I';
  public view = 'out';
  public myInterval: any;
  constructor() {}

  ngOnInit() {}

  public showText(text: string, type: string, s = 3000) {
    this.text = text;
    this.type = type;
    if (this.view === 'in') {
      clearInterval(this.myInterval);
    }
    this.view = 'in';
    this.myInterval = setInterval(() => {
      this.view = 'out';
      clearInterval(this.myInterval);
    }, s);
  }
}
