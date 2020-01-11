import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {
  public httpOptions = {};

  constructor(private _http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  public get(url: string): Observable<any> {
    url += (url.includes('?') ? '&' : '?') + `key=${this.getDbKey()}`;
    return this._http.get(url);
  }

  public post(url: string, postData: any): Observable<any> {
    postData['key'] = this.getDbKey();
    return this._http.post(url, postData, this.httpOptions);
  }

  public getDbKey() {
    return Math.floor(Date.now() / 1000)
      .toString(36)
      .toUpperCase();
  }
}
