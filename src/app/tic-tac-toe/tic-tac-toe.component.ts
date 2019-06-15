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
  public humanWin = 0;
  public aiWin = 0;
  public totalGame = 0;
  public displayTxt = '"Play against me" - AI';
  public hardness = 50;
  public completedPercent = 0;
  public isGameInProgress = false;
  public isAIThinking = false;
  public ticTacBoard = ['X', 'E', 'O', 'O', 'X', 'O', 'E', 'O', 'X'];
  public boxStyle = ['G', 'E', 'O', 'O', 'G', 'O', 'E', 'O', 'G'];
  public winningConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  public isAIPlayingFirst = true;

  public styles = {
    'E': { color: '#e9dfd3' },
    'G': { backgroundColor: '#94dc94', color: '#006400' },
    'X': { backgroundColor: '#e9dfd3', color: '#2a78cd' },
    'O': { backgroundColor: '#e9dfd3', color: '#b53030' },
  }

  public gameMessage = 'Click on the start game to Play!';

  public humanMark = 'X';
  public aiMark = 'O';
  public winBgd = 'G';
  public emptyMark = 'E';

  constructor(private _title: Title, private _storage: StorageService, private _router: Router) {
    this._storage.checkForLogin();
  }

  ngOnInit() {
    this._title.setTitle('Tic Tac Toe');
  }

  getBoxStyle(box: number) {
    return this.styles[this.boxStyle[box]];
  }

  public trackByFn(index: number, item: any) {
    return index;
  }

  public gameOver(winner?: string) {
    if (winner == this.aiMark) {
      this.gameMessage = 'You are defeated. I won! Want to play again ?';
      this.aiWin++;
    } else if (winner == this.humanMark) {
      this.gameMessage = 'You won this time, Want to play again ?';
      this.humanWin++;
    } else {
      this.gameMessage = 'Game Tie! You\'re Impressive. Want to play again ?';
    }

    this.totalGame++;
    this.isGameInProgress = false;
    this.computeProgressBar();
  }

  public computeProgressBar() {
    let filled = this.ticTacBoard.filter(x => x !== this.emptyMark).length;
    this.completedPercent = (filled / 9) * 100;
  }

  public humanClickOnBox(box: number) {
    if (!this.isGameInProgress || this.isAIThinking || this.ticTacBoard[box] !== this.emptyMark) return false;

    this.ticTacBoard[box] = this.boxStyle[box] = this.humanMark;

    if (this.checkForGameWin(this.humanMark, this.ticTacBoard, true)) {
      this.gameOver(this.humanMark);
      return;
    } else if (this.checkForGameTie()) {
      this.gameOver();
      return;
    }

    this.gameMessage = 'Nice Move, Let me think where should I play ...';
    this.computeProgressBar();

    this.isAIThinking = true;
    setTimeout(this.playAITurn.bind(this), (Math.random() + 1) * 800);
  }

  public goTo(url: string) {
    this._router.navigateByUrl(url);
  }

  public startGame() {
    this.isGameInProgress = true;
    this.clearBoard();

    if (this.isAIPlayingFirst = !this.isAIPlayingFirst) {
      this.isAIThinking = true;
      setTimeout(this.playAITurn.bind(this), (Math.random() + 1) * 1000);
      this.gameMessage = `MY TURN, let me think where I should play first...`;
    } else {
      this.isAIThinking = false;
      this.gameMessage = `YOUR TURN! Click on the board to place ${this.humanMark}`;
    }
  }

  public clearBoard() {
    this.completedPercent = 0;
    for (let box = 0; box < 9; box++) {
      this.boxStyle[box] = this.ticTacBoard[box] = this.emptyMark;
    }
  }

  public playAITurn() {
    let box = this.getBestNextMoveBox();
    if (box !== undefined) this.boxStyle[box] = this.ticTacBoard[box] = this.aiMark;

    if (this.checkForGameWin(this.aiMark, this.ticTacBoard, true)) {
      this.gameOver(this.aiMark);
      return;
    } else if (this.checkForGameTie()) {
      this.gameOver();
      return;
    }

    this.computeProgressBar();
    this.isAIThinking = false;
    this.gameMessage = `That was easy, Now it's your turn human...`;
  }

  public checkForGameWin(mark: string, board: Array<string>, applyWinStyle = false) {
    for (let i = 0; i < this.winningConditions.length; i++) {
      let [a, b, c] = this.winningConditions[i];
      if (board[a] == mark && board[b] == mark && board[c] == mark) {
        if (applyWinStyle) this.boxStyle[a] = this.boxStyle[b] = this.boxStyle[c] = this.winBgd;
        return true;
      }
    }
    return false;
  }

  public checkForGameTie() {
    return this.emptyIndexies(this.ticTacBoard).length === 0;
  }

  public getBestNextMoveBox() {
    let newMove = this.getBestTicTacMove(this.ticTacBoard.slice(0), this.aiMark);
    return newMove.index;
  }


  //Provides empty boxes of board
  public emptyIndexies(newBoard: Array<string>) {
    return newBoard.map((x, i) => x == this.emptyMark ? i : -1)
      .filter(x => x > -1)
      .sort((a, b) => Math.random() > 0.5 ? 1 : -1);
  }

  public getBestTicTacMove(newBoard: Array<string>, playerMark: string) {
    let availSpots = this.emptyIndexies(newBoard);

    if (this.checkForGameWin(this.humanMark, newBoard)) return { score: -10 };
    else if (this.checkForGameWin(this.aiMark, newBoard)) return { score: 10 };
    else if (availSpots.length === 0) return { score: 0 };

    let allMoves = [];

    for (let spot = 0; spot < availSpots.length; spot++) {
      let currentMove = {};
      currentMove['index'] = availSpots[spot];

      newBoard[availSpots[spot]] = playerMark;

      let result = this.getBestTicTacMove(newBoard, playerMark == this.aiMark ? this.humanMark : this.aiMark);
      currentMove['score'] = result.score;

      newBoard[availSpots[spot]] = this.emptyMark;
      allMoves.push(currentMove);
    }

    // if it is the computer's turn loop over the moves and choose the move with the highest score
    let bestMove: number;
    if (playerMark === this.aiMark) {
      let bestScore = -Infinity;
      for (let i = 0; i < allMoves.length; i++) {
        if (allMoves[i].score > bestScore) {
          bestScore = allMoves[i].score;
          bestMove = i;
        }
      }
    } else {
      // else loop over the moves and choose the move with the lowest score
      let bestScore = Infinity;
      for (let i = 0; i < allMoves.length; i++) {
        if (allMoves[i].score < bestScore) {
          bestScore = allMoves[i].score;
          bestMove = i;
        }
      }
    }

    // return the chosen move (object) from the array to the higher depth
    return allMoves[bestMove];
  }


}
