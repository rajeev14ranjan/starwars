import { Routes } from '@angular/router';

const AppRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('../login/login-page.module').then(mod => mod.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../dash-board/dash-board.module').then(mod => mod.DashBoardModule)
  },
  {
    path: 'game',
    loadChildren: () =>
      import('../game/game.module').then(mod => mod.GameModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('../admin/admin.module').then(mod => mod.AdminModule)
  },
  {
    path: 'sudoku',
    loadChildren: () =>
      import('../sudoku/sudoku.module').then(mod => mod.SudokuModule)
  },
  {
    path: 'tictactoe',
    loadChildren: () =>
      import('../tic-tac-toe/tic-tac-toe.module').then(
        mod => mod.TicTacToeModule
      )
  },
  {
    path: 'fiddler',
    loadChildren: () =>
      import('../fiddler/fiddler.module').then(mod => mod.FiddlerModule)
  },
  {
    path: 'splitwise',
    loadChildren: () =>
      import('../split-wise/split-wise.module').then(mod => mod.SplitWiseModule)
  },
  {
    path: '**',
    loadChildren: () =>
      import('../error-page/error-page.module').then(mod => mod.ErrorPageModule)
  }
];

export { AppRoutes };
