import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PopUpComponent } from './pop-up.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [PopUpComponent],
  imports: [CommonModule, ModalModule.forRoot()],
  exports: [PopUpComponent]
})
export class PopUpModule {}
