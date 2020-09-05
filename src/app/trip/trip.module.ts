import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TripComponent } from './trip.component';
import { AntdModule } from '../and-design/antd.module';

const routes: Routes = [{ path: '', component: TripComponent }];

@NgModule({
  declarations: [TripComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AntdModule
  ]
})
export class TripModule {}
