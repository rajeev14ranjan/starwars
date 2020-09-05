import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: './login/login-page.module#LoginPageModule'
  },
  {
    path: 'dashboard',
    loadChildren: './dash-board/dash-board.module#DashBoardModule'
  },
  {
    path: 'game',
    loadChildren: './game/game.module#GameModule'
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule'
  },
  {
    path: 'about',
    loadChildren: './about/about.module#AboutModule'
  },
  {
    path: 'sudoku',
    loadChildren: './sudoku/sudoku.module#SudokuModule'
  },
  {
    path: 'tictactoe',
    loadChildren: './tic-tac-toe/tic-tac-toe.module#TicTacToeModule'
  },
  {
    path: 'trip',
    loadChildren: './trip/trip.module#TripModule'
  },
  {
    path: 'fiddler',
    loadChildren: './fiddler/fiddler.module#FiddlerModule'
  },
  {
    path: 'splitwise',
    loadChildren: './split-wise/split-wise.module#SplitWiseModule'
  },
  {
    path: '**',
    loadChildren: './error-page/error-page.module#ErrorPageModule'
  }
];
