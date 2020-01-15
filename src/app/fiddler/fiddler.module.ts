import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { FiddlerComponent } from './fiddler.component';

const routes: Routes = [{ path: '', component: FiddlerComponent }];

@NgModule({
  declarations: [FiddlerComponent],
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule]
})
export class FiddlerModule {}
