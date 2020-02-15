import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './login-page.component';
import { FloatTextModule } from '../float-text/float-text.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { AntdModule } from '../and-design/antd.module';

const routes: Routes = [{ path: '', component: LoginPageComponent }];

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FloatTextModule,
    FeedbackModule,
    AntdModule
  ]
})
export class LoginPageModule {}
