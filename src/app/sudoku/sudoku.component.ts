import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../service/browser-storage.service';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css'],
})
export class SudokuComponent implements OnInit {
  public puzzle: Array<any>;
  public answer: Array<any>;
  public option: Array<number>;
  public isComplete = false;
  public displayTxt = 'Enter Sudoku puzzle';
  public size = 9;
  public hardness = 60;
  public prefilled = new Map<number, boolean>();
  public error = { r: -1, c: -1 };
  public mode = 'S';

  constructor(private _title: Title, private _localStorage: StorageService) {
    this._localStorage.checkForLogin();
  }

  ngOnInit() {
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

  public entered(event: any, r: number, c: number) {
    if (event.target.readOnly) return;
    if (event.key === '0' || event.key === 'e' || event.key === 'Delete') {
      this.puzzle[r][c] = '';
    }
    let key = parseInt(event.key, 10);
    if (key) {
      this.puzzle[r][c] = key;
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

  public checkProper(
    matrix: Array<Array<number>>,
    r: number,
    c: number,
    newNum: number
  ) {
    //check for row and column contraint
    for (let i = 0; i < this.size; i++) {
      if (matrix[r][i] && i !== c && matrix[r][i] === newNum) return false;
      if (matrix[i][c] && i !== r && matrix[i][c] === newNum) return false;
    }

    //check for Box contraint
    let row = ((r / 3) >> 0) * 3,
      col = ((c / 3) >> 0) * 3;

    for (let i = row; i < row + 3; i++) {
      for (let j = col; j < col + 3; j++) {
        if (i !== r && j !== c && matrix[i][j] && matrix[i][j] === newNum)
          return false;
      }
    }

    return true;
  }

  public getStyle(r: number, c: number) {
    return this.mode === 'P'
      ? this.getPracticeStyle(r, c)
      : this.getSolveStyle(r, c);
  }

  public getPracticeStyle(r: number, c: number) {
    let row = (r / 3) >> 0;
    let col = (c / 3) >> 0;

    let style = {
      color: '#797979',
    };

    if (this.error.r == r && this.error.c == c) {
      style['backgroundColor'] = 'red';
      style['color'] = 'white';
    } else if (!((row + col) & 1)) {
      style['backgroundColor'] = '#ffeccf';
    }
    if (this.prefilled.get(r * this.size + c)) {
      style['color'] = 'blue';
      style['fontWeight'] = 'bold';
    }

    return style;
  }

  //Generator to return the random option from randomly sorted array
  public getRandomGenerator() {
    const sOption = this.option.sort(() => Math.floor(Math.random() * 3 - 1));

    return function () {
      sOption.sort(() => Math.floor(Math.random() * 3 - 1));
      return sOption;
    };
  }

  //Start solving soduku by calling recursive function
  public prepareSudokuSolution() {
    this.initializeArrays();
    this.generateSolution(this.getRandomGenerator(), this.answer);
  }

  public generateSolution(generator: Function, matrix: Array<Array<any>>) {
    let next = this.nextEmpty(matrix);

    if (next.complete) {
      return true;
    }

    for (let newNum of generator(next)) {
      if (this.checkProper(matrix, next.r, next.c, newNum)) {
        matrix[next.r][next.c] = newNum;
        if (this.generateSolution(generator, matrix)) {
          return true;
        }
        matrix[next.r][next.c] = '';
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

  public clearSudokuSpace() {
    this.setError(-1, -1);
    this.initializeArrays();
    this.prefilled.clear();
  }

  public onModeChange(mode: string) {
    this.mode = mode;
    this.clearSudokuSpace();
    if (mode === 'S') {
      this.displayTxt = 'Enter Sudoku puzzle';
    } else {
      this.displayTxt = 'Practice Sudoku';
    }
  }

  //------------------solve mode-------------
  public isSolved = false;
  public getSolveStyle(r: number, c: number) {
    let row = (r / 3) >> 0;
    let col = (c / 3) >> 0;

    let style = {
      color: '#797979',
    };

    if (this.error.r == r && this.error.c == c) {
      style['backgroundColor'] = 'red';
      style['color'] = 'white';
    } else if (!((row + col) & 1)) {
      style['backgroundColor'] = '#ffeccf';
    }
    if (this.prefilled.get(r * this.size + c)) {
      style['color'] = 'blue';
      style['fontWeight'] = 'bold';
    }

    return style;
  }

  public verifySudoku(): boolean {
    let isValidSudoku = false;
    let isSudokuEmpty = true;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.puzzle[i][j]) {
          isSudokuEmpty = false;
          isValidSudoku = this.checkProper(
            this.puzzle,
            i,
            j,
            this.puzzle[i][j]
          );
          if (!isValidSudoku) {
            this.displayTxt = 'Invalid Sudoku, Please enter valid sudoku';
            this.error = { r: i, c: j };
            return false;
          }
        }
      }
    }
    this.error = { r: -1, c: -1 };

    if (isSudokuEmpty) {
      this.displayTxt = 'Sudoku Empty, Please fill values';
      return false;
    }

    if (this.isSolved) {
      this.displayTxt = 'Sudoku already solved';
      return false;
    }

    this.displayTxt = 'Solving sudoku...';
    return true;
  }

  public registerFilledValues(): Array<number> {
    let indices = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.puzzle[r][c]) {
          let index = r * this.size + c;
          this.prefilled.set(index, true);
          indices.push(index);
        }
      }
    }
    return indices;
  }

  public propogateValues(
    probableAnswer: Array<Set<number>>,
    r: number,
    c: number,
    value: number,
    processed: Set<number>
  ): Array<number> {
    let indices: Array<number> = [];
    let impactedIndices: Set<number> = new Set();

    //row and column imapcted index
    for (let i = 0; i < this.size; i++) {
      impactedIndices.add(r * this.size + i).add(i * this.size + c);
    }

    //box impacted index
    let boxRow = ((r / 3) >> 0) * 3,
      boxCol = ((c / 3) >> 0) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        impactedIndices.add(i * this.size + j);
      }
    }

    //deleting the original index
    impactedIndices.delete(r * this.size + c);

    for (let index of Array.from(impactedIndices)) {
      probableAnswer[index].delete(value);
      if (probableAnswer[index].size === 1 && !processed.has(index)) {
        processed.add(index);
        indices.push(index);
      }
    }

    return indices;
  }

  public solveSudoku() {
    if (!this.verifySudoku()) {
      return;
    }

    let probableAnswer: Array<Set<number>> = new Array(81)
      .fill(0)
      .map((x) => new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));

    //register and adapt probable answer
    let indices = this.registerFilledValues();

    this.reduceProbableAnswers(indices, probableAnswer);

    this.isSolved = this.generateSolution(
      this.getProbableGenerator(probableAnswer),
      this.puzzle
    );

    this.displayTxt = this.isSolved
      ? 'Sudoku Solved'
      : 'Sudoku could not be solved';
  }

  // running constant propagation
  public reduceProbableAnswers(
    indices: Array<number>,
    probableAnswer: Array<Set<number>>
  ) {
    let i: number, r: number, c: number, value: number;
    let processed = new Set(indices);

    while (indices.length) {
      i = indices.pop();

      r = (i / this.size) >> 0;
      c = i % this.size;

      value = this.puzzle[r][c];

      if (value) {
        probableAnswer[i].clear();
        probableAnswer[i].add(value);
      } else {
        value = Array.from(probableAnswer[i])[0];
      }

      indices.push(
        ...this.propogateValues(probableAnswer, r, c, value, processed)
      );
    }
  }

  //Get generator
  public getProbableGenerator(probableAnswer: Array<Set<number>>) {
    return ({ r, c }) => Array.from(probableAnswer[r * this.size + c]);
  }

  public clearSolution() {
    if (!this.isSolved) {
      this.clearSudokuSpace();
      return;
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (!this.prefilled.get(i * this.size + j)) {
          this.puzzle[i][j] = '';
        }
      }
    }
    this.isSolved = false;
  }
}
