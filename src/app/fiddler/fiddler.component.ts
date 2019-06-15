import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/browser-storage.service';
import { HttpHelperService } from '../service/http-helper.service';

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
  constructor(private _storage : StorageService, private _dbcon : HttpHelperService) { 
    this._storage.checkForLogin();
  }

  fetchData(){
    this.response = 'fetching response....';
    this.bgColor = {backgroundColor : 'white'};

    if(this.requestType === 'get'){
      this._dbcon.get(this.apiUrl).subscribe(
        response => this.response = response,
        error => this.response = error
      )
    }else{
      let postData = {};
      try{
        postData = JSON.parse(this.postObj);
      }catch(e){
        this.response = {Error : 'Invalid Post data Object'};
        return;
      };
      this._dbcon.post(this.apiUrl, postData).subscribe(
        response => this.response = response,
        error => this.response = {...error, postData : postData}
      )
    }
  }



}
