import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { StorageService } from './service/browser-storage.service';
import { RoutingComponent } from './routing/routing-component';
import { AppRoutes } from './routing/appRoutes';
import { HttpHelperService } from './service/http-helper.service';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [RoutingComponent, SpinnerComponent],
  imports: [
    RouterModule.forRoot(AppRoutes),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [StorageService, Title, HttpHelperService],
  bootstrap: [RoutingComponent]
})
export class AppModule {}
