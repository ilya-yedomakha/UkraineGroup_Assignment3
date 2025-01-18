import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { ExamplePageComponent } from './pages/example-page/example-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import {MatTableModule} from '@angular/material/table';
import { BonusesPageComponent } from './pages/bonuses-page/bonuses-page.component';
import { TableSalesmenBonusesComponent} from './components/tables/table-salesmen-bonuses/table-salesmen-bonuses.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChangeBonusesPageComponent } from './pages/change-bonuses-page/change-bonuses-page.component';
import { TableSocialBonusesComponent } from './components/tables/table-social-bonuses/table-social-bonuses.component';
import { TableOrdersBonusesComponent } from './components/tables/table-orders-bonuses/table-orders-bonuses.component';
import { TableSalesmanCabinetComponent } from './components/tables/table-salesman-cabinet/table-salesman-cabinet.component';
import { SalesmanCabinetPageComponent } from './pages/salesman-cabinet-page/salesman-cabinet-page.component';
import { BarGraphSalesmanBonusesComponent } from './components/diagrams/bar-graph-salesman-bonuses/bar-graph-salesman-bonuses.component';
import { NgChartsModule } from 'ng2-charts';
import {NgxPaginationModule} from 'ngx-pagination';
import { SalesmenPageComponent } from './pages/salesmen-page/salesmen-page.component';
import { TableSalesmenComponent } from './components/tables/table-salesmen/table-salesmen.component';
import { RejectBonusesCalculationWindowComponent } from './components/popouts/reject-bonuses-calculation-window/reject-bonuses-calculation-window.component';
import { AddSocialPerformanceWindowComponent } from './components/popouts/add-social-performance-window/add-social-performance-window.component';
import { ForbiddenPageComponent } from './pages/forbiden-page/forbidden-page.component';
import { CalculateConfirmationWindowComponent } from './components/popouts/calculate-confirmation-window/calculate-confirmation-window.component';
import { TableManageSocialPerformanceComponent } from './components/tables/table-manage-social-performance/table-manage-social-performance.component';
import { TableViewSalePerformanceComponent } from './components/tables/table-view-sale-performance/table-view-sale-performance.component';
import { AboutBonusCalculationDropDownComponent } from './components/popouts/about-bonus-calculation-drop-down/about-bonus-calculation-drop-down.component';
import { WelcomeAdminDashboardComponent } from './pages/welcome-admin-dashboard/welcome-admin-dashboard.component';
import { CustomSnackBarComponent } from './components/popouts/custom-snack-bar/custom-snack-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { TableUsersComponent } from './components/tables/table-users/table-users.component';
import { PieCountConfirmationStatisticsComponent } from './components/diagrams/pie-count-confirmation-statistics/pie-count-confirmation-statistics.component';
import { BarSalesmenRatingComponent } from './components/diagrams/bar-salesmen-rating/bar-salesmen-rating.component';
import { ToggleSwitchComponent} from './components/toggle-switch/toggle-switch.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        LoginComponent,
        LandingPageComponent,
        MenuBarComponent,
        ExamplePageComponent,
        NotFoundPageComponent,
        BonusesPageComponent,
        TableSalesmenBonusesComponent,
        FooterComponent,
        ChangeBonusesPageComponent,
        TableSocialBonusesComponent,
        TableOrdersBonusesComponent,
        TableSalesmanCabinetComponent,
        SalesmanCabinetPageComponent,
        BarGraphSalesmanBonusesComponent,
        SalesmenPageComponent,
        TableSalesmenComponent,
        RejectBonusesCalculationWindowComponent,
        AddSocialPerformanceWindowComponent,
        ForbiddenPageComponent,
        TableViewSalePerformanceComponent,
        TableManageSocialPerformanceComponent,
        CalculateConfirmationWindowComponent,
        AboutBonusCalculationDropDownComponent,
        WelcomeAdminDashboardComponent,
        CustomSnackBarComponent,
        UsersPageComponent,
        TableUsersComponent,
        PieCountConfirmationStatisticsComponent,
        BarSalesmenRatingComponent,
        AboutBonusCalculationDropDownComponent,
        ToggleSwitchComponent
    ],
    imports: [
        BrowserModule,
        AppRouting,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatTableModule,
        NgChartsModule,
        NgxPaginationModule,
        ReactiveFormsModule,
        MatSnackBarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
