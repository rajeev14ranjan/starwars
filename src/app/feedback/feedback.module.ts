import { NgModule } from '@angular/core';
import { FeedbackComponent } from './feedback.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AntdModule } from '../and-design/antd.module';

@NgModule({
  declarations: [FeedbackComponent],
  imports: [CommonModule, FormsModule, AntdModule],
  exports: [FeedbackComponent]
})
export class FeedbackModule {}
