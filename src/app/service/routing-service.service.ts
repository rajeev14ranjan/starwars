import { Injectable } from '@angular/core';

@Injectable()
export class RoutingService {

  constructor() { }

  public getCoordinate(el) {
    if(el){
    let rect = el.getBoundingClientRect();
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { 
      top: Math.floor(rect.top + scrollTop), 
      right : Math.floor(rect.right),
      bottom: Math.floor(rect.bottom), 
      left: Math.floor(rect.left+scrollLeft) }
    }
  }

}
