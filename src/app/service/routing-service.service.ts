import { Injectable } from '@angular/core';

@Injectable()
export class RoutingService {

  constructor() { }

  public getCoordinate(el) {
    let rect = el.getBoundingClientRect();
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, right : rect.right,bottom: rect.bottom, left: rect.left+scrollLeft }
  }

}
