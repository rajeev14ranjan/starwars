import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../service/browser-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})
export class SudokuComponent implements OnInit {
  public isAdmin: boolean;
  public isGuestUser: boolean;
  public loggedUserID: number;
  public puzzle: Array<any>;
  public answer: Array<any>;
  public option: Array<number>;
  public isComplete = false;
  public displayTxt = 'Play Sudoku';
  public size = 9;
  public hardness = 60;
  public prefilled = new Map<number, boolean>();
  public error = { r: -1, c: -1 };

  constructor(private _title: Title, private _localStorage: StorageService) {
    this._localStorage.checkForLogin();
  }

  ngOnInit() {
    this.isAdmin = this._localStorage.isAdmin();
    this.isGuestUser = this._localStorage.isGuestUser;
    this.loggedUserID = this._localStorage.loggedUser.userid;
    this._title.setTitle('Sudoku');
    this.initializeArrays();
  }

  public initializeArrays() {
    this.puzzle = new Array<any>();
    this.answer = new Array<any>();
    this.option = new Array<number>();
    this.isComplete = false;

    for (let i = 0; i < this.size; i++) {
      this.puzzle.push(new Array<Number>(this.size));
      this.answer.push(new Array<Number>(this.size));
      this.option.push(1 + i);
    }
  }

  public entered(r: number, c: number, num: string) {
    let no = parseInt(this.puzzle[r][c], 10);

    if (no) {
      if (no > 10) {
        no = no % 10;
      }
      this.puzzle[r][c] = no ? no : '';
    } else {
      this.puzzle[r][c] = '';
    }
  }

  // Login to fill soduku
  public nextEmpty(arry: any) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (!arry[i][j]) {
          return { r: i, c: j };
        }
      }
    }

    return { complete: true };
  }

  public trackByFn(index: number, item: any) {
    return index;
  }

  public checkProper(r: number, c: number, newNum: number) {
    for (let i = 0; i < this.size; i++) {
      if (this.answer[r][i] && i != c && this.answer[r][i] == newNum)
        return false;
      if (this.answer[i][c] && i != r && this.answer[i][c] == newNum)
        return false;
    }

    //checking for Box contraint
    let row = ((r / 3) >> 0) * 3,
      col = ((c / 3) >> 0) * 3;

    for (let i = row; i < row + 3; i++) {
      for (let j = col; j < col + 3; j++) {
        if (
          i != r &&
          j != c &&
          this.answer[i][j] &&
          this.answer[i][j] == newNum
        )
          return false;
      }
    }

    return true;
  }

  public getStyle(r: number, c: number) {
    let row = (r / 3) >> 0;
    let col = (c / 3) >> 0;

    let style = {
      color: '#797979'
    };

    if (this.error.r == r && this.error.c == c) {
      style['backgroundColor'] = 'red';
      style['color'] = 'white';
    } else if (!((row + col) & 1)) {
      style['backgroundColor'] = '#ffeccf';
    }
    if (this.prefilled.get(r * this.size + c)) {
      style['color'] = 'black';
      style['fontWeight'] = 'bold';
    }

    return style;
  }

  //Generator to return the random option from randomly sorted array
  public getRandomGenerator() {
    let sOption = this.option.sort((a, b) => Math.floor(Math.random() * 3 - 1));
    let pointer = 0;

    return function() {
      pointer =
        ((pointer + 1 + Math.random() * sOption.length) >> 0) % sOption.length;
      return sOption[pointer];
    };
  }

  //Start solving soduku by calling recursive function
  public prepareSudokuSolution() {
    this.initializeArrays();
    this.generateSolution(this.getRandomGenerator());
  }

  public generateSolution(generator: Function) {
    let next = this.nextEmpty(this.answer);

    if (next.complete) {
      return true;
    }

    for (let opt = 0; opt < this.size; opt++) {
      let newNum = generator();

      if (this.checkProper(next.r, next.c, newNum)) {
        this.answer[next.r][next.c] = newNum;
        if (this.generateSolution(generator)) {
          return true;
        }
        this.answer[next.r][next.c] = '';
      }
    }
    return false;
  }

  //verify soduku
  public checkSudoku() {
    this.setError(-1, -1);
    let next = this.nextEmpty(this.puzzle);
    if (!next.complete) {
      this.displayTxt = 'First Complete the Sudoku';
      this.setError(next.r, next.c);
      return false;
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.puzzle[i][j] != this.answer[i][j]) {
          this.displayTxt = 'Incorrect Soduku Solution';
          this.setError(i, j);
          return false;
        }
      }
    }

    this.displayTxt = 'Correct Solution';
    return true;
  }

  private setError(row: number, col: number) {
    this.error.r = row;
    this.error.c = col;
  }

  public getPrfeillFlag(r: number, c: number) {
    return this.prefilled.get(r * this.size + c);
  }

  public prepareNewSoduku() {
    this.displayTxt = 'New Sudoku Generated';
    this.setError(-1, -1);
    this.prepareSudokuSolution();

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let index = i * this.size + j;

        if (Math.random() > this.hardness / 100) {
          this.puzzle[i][j] = this.answer[i][j];
          this.prefilled.set(index, true);
        } else {
          this.puzzle[i][j] = '';
          this.prefilled.set(index, null);
        }
      }
    }
  }

  public resetSoduku() {
    this.displayTxt = 'Sudoku Reset to Original Condition';
    this.setError(-1, -1);
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.puzzle[i][j] = this.prefilled.get(i * this.size + j)
          ? this.answer[i][j]
          : '';
      }
    }
  }
}
