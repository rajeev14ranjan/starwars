import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './login-page.component';
import { FloatTextModule } from '../float-text/float-text.module';
import { FeedbackModule } from '../feedback/feedback.module';

const routes: Routes = [{ path: '', component: LoginPageComponent }];

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    FloatTextModule,
    FeedbackModule
  ]
})
export class LoginPageModule {}
