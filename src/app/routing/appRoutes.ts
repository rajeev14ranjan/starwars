import { Routes } from '@angular/router';
import { LoginPageComponent } from '../login/login-page.component';
import { GameComponent } from '../game/game.component';
import { ErrorPageComponent } from '../error-page/error-page.component';
import { AdminComponent } from '../admin/admin.component';
import { SudokuComponent } from '../sudoku/sudoku.component';
import { DashBoardComponent } from '../dash-board/dash-board.component';
import { TicTacToeComponent } from '../tic-tac-toe/tic-tac-toe.component';
import { FiddlerComponent } from '../fiddler/fiddler.component';
import { SplitWiseComponent } from '../split-wise/split-wise.component';


export const AppRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPageComponent },
    { path: 'dashboard', component: DashBoardComponent },
    { path: 'game', component: GameComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'sudoku', component: SudokuComponent },
    { path: 'tictactoe', component: TicTacToeComponent },
    { path: 'fiddler', component: FiddlerComponent },
    { path: 'splitwise', component: SplitWiseComponent },
    { path: '**', component: ErrorPageComponent },
];
