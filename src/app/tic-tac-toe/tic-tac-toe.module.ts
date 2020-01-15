import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { TicTacToeComponent } from './tic-tac-toe.component';
import { FloatTextModule } from '../float-text/float-text.module';

const routes: Routes = [{ path: '', component: TicTacToeComponent }];

@NgModule({
  declarations: [TicTacToeComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    FloatTextModule
  ]
})
export class TicTacToeModule {}
