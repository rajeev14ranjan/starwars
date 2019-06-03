import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/browser-storage.service';
import { Title } from '@angular/platform-browser';
import { timeout } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit {

  
  displayTxt = '"Play against me" - AI';
  hardness = 50;
  puzzle = [['O','O','O'],['O','O','O'],['O','O','O']];
  
  constructor(private _title: Title, private _localStorage: StorageService, private _router : Router) {
    this._localStorage.checkForLogin();
   }

  ngOnInit() {
    this._title.setTitle('Tic Tac Toe');
  }

  public getPrfeillFlag(){
    return Math.random() > 0.5 ? 'O' : 'X';
  }

  public trackByFn(index :number, item : any){
    return index;
  } 

  public clickOnBox(r : number, c :number){
    this.puzzle[r][c] = 'X';
  }

  public goTo(url:string){
    this._router.navigateByUrl(url);
  }
}
