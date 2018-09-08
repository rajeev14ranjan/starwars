import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginPageComponent } from './login/login-page.component';
import { BrowserStorageService } from './service/browser-storage.service';
import { RoutingComponent } from './routing/routing-component';
import { AppRoutes } from './routing/appRoutes';
import { GameComponent } from './game/game.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RoutingService } from './service/routing-service.service';
import { AdminComponent } from './admin/admin.component';
import { DotsComponent } from './dots/dots.component';
import { ModalModule } from 'ngx-bootstrap';
import { PopUpComponent } from './pop-up/pop-up.component';
import { FloatTextComponent } from './float-text/float-text.component';



@NgModule({
  declarations: [
    LoginPageComponent,
    RoutingComponent,
    GameComponent,
    ErrorPageComponent,
    AdminComponent,
    DotsComponent,
    PopUpComponent,
    FloatTextComponent
  ],
  imports: [
    RouterModule.forRoot(AppRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [BrowserStorageService, RoutingService, Title],
  bootstrap: [RoutingComponent]
})
export class AppModule { }
