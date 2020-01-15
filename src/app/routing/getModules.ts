export const LoginPageModule = () =>
  import('../login/login-page.module').then(mod => mod.LoginPageModule);

export const DashBoardModule = () =>
  import('../dash-board/dash-board.module').then(mod => mod.DashBoardModule);

export const GameModule = () =>
  import('../game/game.module').then(mod => mod.GameModule);

export const AdminModule = () =>
  import('../admin/admin.module').then(mod => mod.AdminModule);

export const SudokuModule = () =>
  import('../sudoku/sudoku.module').then(mod => mod.SudokuModule);

export const TicTacToeModule = () =>
  import('../tic-tac-toe/tic-tac-toe.module').then(mod => mod.TicTacToeModule);

export const FiddlerModule = () =>
  import('../fiddler/fiddler.module').then(mod => mod.FiddlerModule);

export const SplitWiseModule = () =>
  import('../split-wise/split-wise.module').then(mod => mod.SplitWiseModule);

export const ErrorPageModule = () =>
  import('../error-page/error-page.module').then(mod => mod.ErrorPageModule);
