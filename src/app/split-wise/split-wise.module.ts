import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { SplitWiseComponent } from './split-wise.component';

const routes: Routes = [{ path: '', component: SplitWiseComponent }];

@NgModule({
  declarations: [SplitWiseComponent],
  imports: [
    CommonModule,
    FormsModule,
    PopoverModule.forRoot(),
    RouterModule.forChild(routes)
  ]
})
export class SplitWiseModule {}
