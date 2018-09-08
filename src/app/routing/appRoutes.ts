import { Routes } from '@angular/router';
import { LoginPageComponent } from '../login/login-page.component';
import { GameComponent } from '../game/game.component';
import { ErrorPageComponent } from '../error-page/error-page.component';
import { AdminComponent } from '../admin/admin.component';


export const AppRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPageComponent },
    { path: 'game', component: GameComponent },
    { path: 'admin', component: AdminComponent },
    { path: '**', component: ErrorPageComponent }
]