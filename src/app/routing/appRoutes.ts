import { Routes } from '@angular/router';
import {
  LoginPageModule,
  DashBoardModule,
  GameModule,
  AdminModule,
  SudokuModule,
  TicTacToeModule,
  FiddlerModule,
  SplitWiseModule,
  ErrorPageModule
} from './getModules';

export const AppRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: LoginPageModule
  },
  {
    path: 'dashboard',
    loadChildren: DashBoardModule
  },
  {
    path: 'game',
    loadChildren: GameModule
  },
  {
    path: 'admin',
    loadChildren: AdminModule
  },
  {
    path: 'sudoku',
    loadChildren: SudokuModule
  },
  {
    path: 'tictactoe',
    loadChildren: TicTacToeModule
  },
  {
    path: 'fiddler',
    loadChildren: FiddlerModule
  },
  {
    path: 'splitwise',
    loadChildren: SplitWiseModule
  },
  {
    path: '**',
    loadChildren: ErrorPageModule
  }
];
