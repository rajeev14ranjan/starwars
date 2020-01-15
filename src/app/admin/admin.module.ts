import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { FloatTextModule } from '../float-text/float-text.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { AdminComponent } from './admin.component';
import { PopUpModule } from '../pop-up/pop-up.module';
import { ModalModule } from 'ngx-bootstrap/modal';

const routes: Routes = [{ path: '', component: AdminComponent }];

@NgModule({
  declarations: [AdminComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    FloatTextModule,
    FeedbackModule,
    PopUpModule,
    ModalModule.forRoot()
  ]
})
export class AdminModule {}
