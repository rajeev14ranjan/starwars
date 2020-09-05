import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd';
registerLocaleData(en);
// registerLocaleData(en_US);
// registerLocaleData(zh_CN);

@NgModule({
  imports: [
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzModalModule,
    NzRateModule,
    NzDatePickerModule
  ],
  exports: [
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzModalModule,
    NzRateModule,
    NzDatePickerModule
  ],
  providers: [NzI18nService]
})
export class AntdModule {}
