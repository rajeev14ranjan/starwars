import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FloatTextModule } from '../float-text/float-text.module';
import { GameComponent } from './game.component';
import { DotsComponent } from '../dots/dots.component';
import { RoutingService } from '../service/routing-service.service';

const routes: Routes = [{ path: '', component: GameComponent }];

@NgModule({
  declarations: [GameComponent, DotsComponent],
  providers: [RoutingService],
  imports: [CommonModule, RouterModule.forChild(routes), FloatTextModule]
})
export class GameModule {}
