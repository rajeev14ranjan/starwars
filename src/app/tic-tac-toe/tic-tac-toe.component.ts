import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/browser-storage.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit {
  public huScore = 0;
  public aiScore = 0;
  public huWin = 0;
  public aiWin = 0;
  public displayTxt = '"Play against me" - AI';
  public hardness = 50;
  public isGameInProgress = false;
  public isAIThinking = false;
  public ticTacBoard = ['X', 'E', 'O', 'O', 'X', 'O','E', 'O', 'X' ];
  public boxStyle =    ['G', 'E', 'O', 'O', 'G', 'O', 'E', 'O', 'G' ];
  public winningConditions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    
  public styles = {
    'E': { color: '#e9dfd3' },
    'G': { backgroundColor: '#94dc94' },
    'X': { backgroundColor: '#e9dfd3', color: '#2a78cd' },
    'O': { backgroundColor: '#e9dfd3', color: '#b53030' },
  }

  public gameMessage = 'Click on the start game to Play!';

  public humanMark = 'X';
  public aiMark = 'O';
  public winBgd = 'G';

  constructor(private _title: Title, private _localStorage: StorageService, private _router: Router) {
    this._localStorage.checkForLogin();
  }

  ngOnInit() {
    this._title.setTitle('Tic Tac Toe');
  }

  public getPrfeillFlag() {
    return Math.random() > 0.5 ? this.humanMark : this.aiMark;
  }

  getBoxStyle(box: number) {
    return this.styles[this.boxStyle[box]];
  }

  public trackByFn(index: number, item: any) {
    return index;
  }

  public humanWon(){
    this.gameMessage = 'You won this time, Want to play again ?';
    this.huScore++;
    this.huWin++;
    this.isGameInProgress = false;
  }

  public aiWon(){
    this.gameMessage = 'Hurray! I defeated you. Want to play again ?';
    this.aiScore++;
    this.aiWin++;
    this.isGameInProgress = false;
  }

  public humanClickOnBox(box : number) {
    if (!this.isGameInProgress || this.isAIThinking || this.ticTacBoard[box] !== 'E') return false;

    this.ticTacBoard[box] = this.boxStyle[box] = this.humanMark;

    if(this.checkForGameWin(this.humanMark)){
      this.humanWon();
      return;
    }

    this.gameMessage = 'Nice Move, Let me think where should I play ...';

    this.isAIThinking = true;
    setTimeout(this.playAITurn.bind(this), (Math.random() + 1) * 800);
  }

  public goTo(url: string) {
    this._router.navigateByUrl(url);
  }

  public startGame() {
    this.isGameInProgress = true;
    this.isAIThinking = false;
    this.clearBoard();
    this.gameMessage = `Game Started! Click on the board to place ${this.humanMark}`;
  }

  public clearBoard() {
    for (let box = 0; box < 9; box++) {
        this.boxStyle[box] = this.ticTacBoard[box] = 'E';
    }
  }

  public playAITurn() {
    const box = this.getAIbestBoxToMark();
    if (box == -1) {
      this.gameMessage = `Tie ? Human, I am inpressed by you!`;
      this.isGameInProgress = this.isAIThinking = false;
    } else {
      this.boxStyle[box] = this.ticTacBoard[box] = this.aiMark;

      if(this.checkForGameWin(this.aiMark)){
        this.aiWon();
        return;
      }

      this.isAIThinking = false;
      this.gameMessage = `That was tough, You turn human now...`;
    }
  }

  public checkForGameWin(mark : string) {
    let board = this.ticTacBoard;
     for(let i =0 ; i < this.winningConditions.length; i ++){
       let [a,b,c] = this.winningConditions[i];
       if(board[a] == mark && board[b] == mark && board[c] == mark){
          this.boxStyle[a] = this.boxStyle[b] = this.boxStyle[c] = this.winBgd;
          return true;
       }
     }
     return false;
  }

  public getAIbestBoxToMark() {
    return this.getNextEmptyBox();
  }

  public getNextEmptyBox() {
    for (let box = 0; box < 9; box++) {
        if (this.ticTacBoard[box] == 'E')
          return box;
    }
    return -1;
  }


}
