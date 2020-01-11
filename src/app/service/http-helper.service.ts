import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {
  private httpOptions = {};
  private connectionCount = 0;
  private start: Function;
  private complete: Function;
  public isConnActive = new Subject<boolean>();

  constructor(private _http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.start = this.updateActiveCount.bind(this, 1);
    this.complete = this.updateActiveCount.bind(this, -1);
  }

  public updateActiveCount(connectionDelta: number, spinner: boolean) {
    if (spinner) {
      this.connectionCount += connectionDelta;
      this.isConnActive.next(this.connectionCount > 0);
    }
  }

  public get(url: string, spinner = false): Observable<any> {
    url += (url.includes('?') ? '&' : '?') + `key=${this.getDbKey()}`;
    this.start(spinner);
    return this._http.get(url).pipe(
      finalize(() => {
        this.complete(spinner);
      })
    );
  }

  public post(url: string, postData: any, spinner = false): Observable<any> {
    postData['key'] = this.getDbKey();
    this.start(spinner);
    return this._http.post(url, postData, this.httpOptions).pipe(
      finalize(() => {
        this.complete(spinner);
      })
    );
  }

  public getDbKey() {
    return Math.floor(Date.now() / 1000)
      .toString(36)
      .toUpperCase();
  }
}
