import { NgModule } from '@angular/core';
import { FeedbackComponent } from './feedback.component';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    RatingModule.forRoot()
  ],
  exports: [FeedbackComponent]
})
export class FeedbackModule {}
