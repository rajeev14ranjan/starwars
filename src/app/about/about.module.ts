import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { FloatTextModule } from '../float-text/float-text.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { AboutComponent } from './about.component';
import { ModalModule } from 'ngx-bootstrap/modal';

const routes: Routes = [{ path: '', component: AboutComponent }];

@NgModule({
  declarations: [AboutComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    FloatTextModule,
    FeedbackModule,
    ModalModule.forRoot()
  ]
})
export class AboutModule {}
