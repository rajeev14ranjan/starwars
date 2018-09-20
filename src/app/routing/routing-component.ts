import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../service/browser-storage.service';

@Component({
  selector: 'routing-page',
  templateUrl: './routing-component.html',
  styleUrls: ['./routing-component.css']
})
export class RoutingComponent implements OnInit, OnDestroy {


  constructor(private _router:Router, private _localStorage:StorageService) { }

  ngOnInit() {

  }

  showBar() : boolean{
    let url:string = this._router.url;
    return url == '/game' || url == '/admin';
  }

  isAdmin(){
    return (this._localStorage.loggedUserID == 'rr' && this._localStorage.loggedUserName.includes('Rajeev'));
  }

  goTO(urlStr:string){
    this._router.navigateByUrl(urlStr);
  }

  userName(){
    return this._localStorage.loggedUserName;
  }

  logout(){
    this._localStorage.saveUserLog();
    this._localStorage.loggedUserName = null;
    this._localStorage.uniquieLogid = null;
    this._router.navigateByUrl('login');
  }

  ngOnDestroy(){
    this._localStorage.saveUserLog();
    this._localStorage.uniquieLogid = null;
  }

}
