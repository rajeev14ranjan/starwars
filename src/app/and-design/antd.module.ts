import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@NgModule({
  imports: [
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule
  ],
  exports: [
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule
  ]
})
export class AntdModule {}
