import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  RouterEvent,
  NavigationStart,
  NavigationEnd
} from '@angular/router';
import { StorageService } from '../service/browser-storage.service';
import { HttpHelperService } from '../service/http-helper.service';

@Component({
  selector: 'routing-page',
  templateUrl: './routing-component.html',
  styleUrls: ['./routing-component.css']
})
export class RoutingComponent implements OnInit, OnDestroy {
  public isRouterLoading: boolean;
  public isXHRActive: boolean;
  constructor(
    private _router: Router,
    private _localStorage: StorageService,
    private _http: HttpHelperService
  ) {
    _router.events.subscribe((event: RouterEvent): void => {
      if (event instanceof NavigationStart) {
        this.isRouterLoading = true;
      } else if (event instanceof NavigationEnd) {
        this.isRouterLoading = false;
      }
    });
  }

  ngOnInit() {
    this._http.isConnActive.asObservable().subscribe(isActive => {
      this.isXHRActive = isActive;
    });
  }

  showBar(): boolean {
    return this._router.url !== '/login' && !!this._localStorage.loggedUserName;
  }

  isAdmin() {
    return this._localStorage.isAdmin();
  }

  goTO(urlStr: string) {
    this._router.navigateByUrl(urlStr);
  }

  userName() {
    return this._localStorage.loggedUserName;
  }

  logout() {
    this._localStorage.loggedUserName = null;
    this._localStorage.uniquieLogid = null;
    this._localStorage.deleteAutoLoginToken();
    this._router.navigateByUrl('login');
  }

  ngOnDestroy() {
    this._localStorage.saveUserLog();
    this._localStorage.uniquieLogid = null;
  }
}
