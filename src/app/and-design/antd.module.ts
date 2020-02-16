import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRateModule } from 'ng-zorro-antd/rate';

@NgModule({
  imports: [
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzModalModule,
    NzRateModule
  ],
  exports: [
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzModalModule,
    NzRateModule
  ]
})
export class AntdModule {}
