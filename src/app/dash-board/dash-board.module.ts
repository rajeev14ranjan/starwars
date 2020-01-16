import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DashBoardComponent } from './dash-board.component';
import { FloatTextModule } from '../float-text/float-text.module';
import { FeedbackModule } from '../feedback/feedback.module';

const routes: Routes = [{ path: '', component: DashBoardComponent }];

@NgModule({
  declarations: [DashBoardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FloatTextModule,
    FeedbackModule
  ]
})
export class DashBoardModule {}
