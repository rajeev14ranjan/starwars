import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorPageComponent } from './error-page.component';

const routes: Routes = [{ path: '', component: ErrorPageComponent }];

@NgModule({
  declarations: [ErrorPageComponent],
  imports: [RouterModule.forChild(routes)]
})
export class ErrorPageModule {}
