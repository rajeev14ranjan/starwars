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
  public response : any;
  public bgColor = {backgroundColor : 'white'};
  public isFetching = false;
  constructor(private _storage : StorageService, private _dbcon : HttpHelperService) { 
    this._storage.checkForLogin();
  }

  fetchData(){
    this.response = 'fetching response....';
    this.bgColor = {backgroundColor : 'white'};
    let requestObs : Observable<any>;

    if(this.requestType === 'get'){
      requestObs = this._dbcon.get(this.apiUrl);
    }else{
      let postData = {};
      try{
        postData = JSON.parse(this.postObj);
      }catch(e){
        this.response = {Error : 'Invalid Post data Object'};
        return;
      };
      requestObs = this._dbcon.post(this.apiUrl, postData);
    }

    this.isFetching = true;

    requestObs.subscribe(
      response => {
        this.response = response;
        this.bgColor.backgroundColor = '#bef6cd';
        this.isFetching = false;
      },
      error => {
        this.response = error;
        this.bgColor.backgroundColor = '#f6bebe';
        this.isFetching = false;
      }
    )
  }



}
