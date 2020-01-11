import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/browser-storage.service';
import { HttpHelperService } from '../service/http-helper.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'fiddler',
  templateUrl: './fiddler.component.html',
  styleUrls: ['./fiddler.component.css']
})
export class FiddlerComponent {
  public requestType = 'get';
  public apiUrl = 'api/stars.php';
  public postObj = '{}';
  public response: any;
  public bgColor = { backgroundColor: 'white' };
  public errorBg = '#f6bebe';
  public successBg = '#bef6cd';
  public isFetching = false;
  constructor(
    private _storage: StorageService,
    private _dbCon: HttpHelperService
  ) {
    this._storage.checkForLogin();
  }

  fetchData() {
    this.response = 'fetching response....';
    this.bgColor.backgroundColor = 'white';
    let $requestObs: Observable<any>;

    if (this.requestType === 'get') {
      $requestObs = this._dbCon.get(this.apiUrl, true);
    } else {
      let postData = {};
      try {
        postData = JSON.parse(this.postObj);
      } catch (e) {
        this.bgColor.backgroundColor = this.errorBg;
        this.response = {
          Error: 'Invalid Post data Object',
          Description: e.toString()
        };
        return;
      }
      $requestObs = this._dbCon.post(this.apiUrl, postData, true);
    }

    this.isFetching = true;

    $requestObs.subscribe(
      response => {
        this.response = response;
        this.bgColor.backgroundColor = this.successBg;
        this.isFetching = false;
      },
      error => {
        this.response = error;
        this.bgColor.backgroundColor = this.errorBg;
        this.isFetching = false;
      }
    );
  }
}
