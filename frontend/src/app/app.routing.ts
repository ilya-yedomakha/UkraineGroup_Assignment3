import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {AuthGuardService} from './services/auth-guard.service';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {BonusesPageComponent} from './pages/bonuses-page/bonuses-page.component';
import { ChangeBonusesPageComponent } from './pages/change-bonuses-page/change-bonuses-page.component';
import { SalesmanCabinetPageComponent } from './pages/salesman-cabinet-page/salesman-cabinet-page.component';
import { SalesmenPageComponent } from './pages/salesmen-page/salesmen-page.component';
import {ForbiddenPageComponent} from './pages/forbiden-page/forbidden-page.component';
import {WelcomeAdminDashboardComponent} from './pages/welcome-admin-dashboard/welcome-admin-dashboard.component';
import {UsersPageComponent} from './pages/users-page/users-page.component';
import { AdminCabinetPageComponent } from './pages/admin-cabinet-page/admin-cabinet-page.component';

/*
  This array holds the relation of paths and components which angular router should resolve.

  If you want add a new page with a separate path/subdirectory you should register it here.
  It is also possible to read parameters from the path they have to be specified with ':' in the path.

  If a new page should also show up in the menu bar, you need to add it there too.
  Look at: frontend/src/app/components/menu-bar/menu-bar.component.ts
 */
const routes: Routes = [
    {path: 'login', component: LoginPageComponent},
    {path: 'salesmen', component: SalesmenPageComponent, canActivate: [AuthGuardService], data: { roles: [0, 1] } },
    {path: 'bonuses', component: BonusesPageComponent, canActivate: [AuthGuardService], data: { roles: [0, 1] } },
    {path: 'bonuses-details', component: ChangeBonusesPageComponent, canActivate: [AuthGuardService], data: { roles: [0, 1, 2] } },
    {path: 'cabinet/:code', component: SalesmanCabinetPageComponent, canActivate: [AuthGuardService], data: { roles: [0, 1] } },
    {path: 'cabinet', component: SalesmanCabinetPageComponent, canActivate: [AuthGuardService], data: { roles: [2] } },
    {path: 'admin-cabinet', component: AdminCabinetPageComponent, canActivate: [AuthGuardService], data: { roles: [0, 1] } },
    {path: '', component: LandingPageComponent},
    {path: 'forbidden', component: ForbiddenPageComponent},
    {path: 'welcome-admin-dashboard', component: WelcomeAdminDashboardComponent, canActivate: [AuthGuardService], data: { roles: [0, 1] } },
    {path: 'users', component: UsersPageComponent, canActivate: [AuthGuardService], data: { roles: [0, 1] } },
    {path: '**', component: NotFoundPageComponent}

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRouting { }
