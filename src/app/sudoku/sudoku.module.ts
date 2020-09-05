import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SudokuComponent } from './sudoku.component';
import { AntdModule } from '../ant-design/antd.module';

const routes: Routes = [{ path: '', component: SudokuComponent }];

@NgModule({
  declarations: [SudokuComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    AntdModule,
  ],
})
export class SudokuModule {}
