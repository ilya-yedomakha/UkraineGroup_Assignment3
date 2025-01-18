import {Component, inject, OnInit} from '@angular/core';
import {BonusesService} from "../../services/bonuses.service";
import { UserService } from 'src/app/services/user.service';
import { SalesmanService } from 'src/app/services/salesman.service';
import { User } from 'src/app/models/User';
import {RejectionService} from "../../services/rejection.service";
import {SalesService} from "../../services/sales.service";

@Component({
    selector: 'app-welcome-admin-dashboard',
    templateUrl: './welcome-admin-dashboard.component.html',
    styleUrls: ['./welcome-admin-dashboard.component.css']
})
export class WelcomeAdminDashboardComponent implements OnInit{
    signedReportsByCEOForCurrentYearCount : number;
    signedReportsByHRForCurrentYearCount :number;
    reportsForCurrentYearCount :number;
    reportsCount :number;
    usersCount :number;
    salesmenCount :number;
    salesForCurrentYearCount :number;
    rejectionsForCurrentYearCount :number;

    signatureByPieLable = "Number of bonuses"
    numberOfSignaturesByCeo: [number, number];
    numberOfSignaturesByHr: [number, number];
    signatureByCeoPieLables: string[] = ["Number of confirmed bonuses by CEO", "Number of unconfirmed bonuses by CEO"]
    signatureByHrPieLables: string[] = ["Number of confirmed bonuses by HR", "Number of unconfirmed bonuses by HR"]

    bonuses = [34,43,23,42,43,53,33]
    salesmenFullname = ["some0", "some1", "some3", "some4", "somet", "some5", "some6"]

    private bonusesService = inject(BonusesService);
    private userService: UserService = inject(UserService);
    private salesmanService: SalesmanService = inject(SalesmanService);
    private salesService: SalesService = inject(SalesService);
    private rejectionService: RejectionService = inject(RejectionService);
    user:User;
    updatingIsLoading: boolean = false;

    ngOnInit(): void {
        this.fetchUser();

        this.fillReportsStatistics();
        this.fillRejectsStatistics();
        this.fillSalesmanStatistics();
        this.fillUsersStatistics();
        this.fillSalesOrdersStatistics();
        this.fillUsersStatistics();


        this.numberOfSignaturesByCeo = [this.signedReportsByCEOForCurrentYearCount,
             this.reportsForCurrentYearCount - this.signedReportsByCEOForCurrentYearCount]

        this.numberOfSignaturesByHr = [this.signedReportsByHRForCurrentYearCount,
            this.reportsForCurrentYearCount - this.signedReportsByHRForCurrentYearCount]
    }


    updateData(){
        //TODO об'єднати два subscribe
        this.updatingIsLoading = true;

        //this.salesmanService.importSeniorSalesmenFromOrangeHRM().subscribe(()=>{
         //   this.updatingIsLoading = false;
       /// });



    }

    fetchUser() {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }

    fillReportsStatistics() {
        this.bonusesService.getSignedByCEOReportsCountForCurrentYear().subscribe((response) => {
            this.signedReportsByCEOForCurrentYearCount = response;
        });

        this.bonusesService.getSignedByHRReportsCountForCurrentYear().subscribe((response) => {
            this.signedReportsByHRForCurrentYearCount = response;
        });

        this.bonusesService.getTotalReportsForCurrentYear().subscribe((response) => {
            this.reportsForCurrentYearCount = response;
        });

        this.bonusesService.getTotalReportsCount().subscribe((response) => {
            this.reportsCount = response;
        });
    }

    fillRejectsStatistics(){
        this.rejectionService.getRejectionsCountByCurrentYear().subscribe((response) => {
            this.rejectionsForCurrentYearCount = response;
        });
    }

    fillUsersStatistics(){
        this.userService.getUsersCount().subscribe((response) => {
            this.usersCount = response;
        });
    }

    fillSalesmanStatistics(){
        this.salesmanService.getSalesmenCount().subscribe((response) => {
            this.salesmenCount = response;
        });
    }

    fillSalesOrdersStatistics(){
        this.salesService.getSalesCountForCurrentYear().subscribe((response) => {
            this.salesForCurrentYearCount = response;
        });
    }
}
