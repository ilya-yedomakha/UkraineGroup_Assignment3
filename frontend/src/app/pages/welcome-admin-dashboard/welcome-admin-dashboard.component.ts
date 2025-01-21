import {Component, inject, OnInit} from '@angular/core';
import {BonusesService} from "../../services/bonuses.service";
import {UserService} from 'src/app/services/user.service';
import {SalesmanService} from 'src/app/services/salesman.service';
import {User} from 'src/app/models/User';
import {RejectionService} from "../../services/rejection.service";
import {SalesService} from "../../services/sales.service";

@Component({
    selector: 'app-welcome-admin-dashboard',
    templateUrl: './welcome-admin-dashboard.component.html',
    styleUrls: ['./welcome-admin-dashboard.component.css']
})
export class WelcomeAdminDashboardComponent implements OnInit {
    signedReportsByCEOForCurrentYearCount: number;
    signedReportsByHRForCurrentYearCount: number;
    reportsForCurrentYearCount: number;
    reportsCount: number;
    usersCount: number;
    salesmenCount: number;
    salesForCurrentYearCount: number;
    rejectionsForCurrentYearCount: number;

    signatureByPieLable = "Number of bonuses"
    numberOfSignaturesByCeo: [number, number];
    numberOfSignaturesByHr: [number, number];
    signatureByCeoPieLables: string[] = ["Number of confirmed bonuses by CEO", "Number of unconfirmed bonuses by CEO"]
    signatureByHrPieLables: string[] = ["Number of confirmed bonuses by HR", "Number of unconfirmed bonuses by HR"]

    bonuses: number[]
    salesmenFullname: string[]

    private bonusesService = inject(BonusesService);
    private userService: UserService = inject(UserService);
    private salesmanService: SalesmanService = inject(SalesmanService);
    private salesService: SalesService = inject(SalesService);
    private rejectionService: RejectionService = inject(RejectionService);
    user: User;
    updatingIsLoading: boolean = false;
    updatingSendIsLoading: boolean = false;
    CEODataIsLoading: boolean = true;
    HRDataIsLoading: boolean = true;
    top10IsLoading: boolean = true;

    ngOnInit(): void {
        this.fetchUser();

        this.fillReportsStatistics();
        this.fillRejectsStatistics();
        this.fillSalesmanStatistics();
        this.fillUsersStatistics();
        this.fillSalesOrdersStatistics();
        this.fillUsersStatistics();
    }


    updateData() {
        //TODO об'єднати два subscribe
        this.updatingIsLoading = true;

        this.salesmanService.importSeniorSalesmenFromOrangeHRM().subscribe(() => {
            this.salesService.importSalesOrdersFromOpenCRX().subscribe(() => {
                this.updatingIsLoading = false;
            });
        });
    }

    sendAllBonusesToHRM() {
        this.updatingSendIsLoading = true;

        this.bonusesService.sendAllBonusesToHRM().subscribe(() => {
            this.updatingSendIsLoading = false;
        });
    }

    fetchUser() {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }

    fillReportsStatistics() {
        this.bonusesService.getTotalReportsForCurrentYear().subscribe((response) => {
            this.reportsForCurrentYearCount = response;

            this.bonusesService.getSignedByCEOReportsCountForCurrentYear().subscribe((response) => {
                this.signedReportsByCEOForCurrentYearCount = response;
                this.numberOfSignaturesByCeo = [this.signedReportsByCEOForCurrentYearCount,
                    this.reportsForCurrentYearCount - this.signedReportsByCEOForCurrentYearCount]

                this.CEODataIsLoading = false;
            });

            this.bonusesService.getSignedByHRReportsCountForCurrentYear().subscribe((response) => {
                this.signedReportsByHRForCurrentYearCount = response;
                this.numberOfSignaturesByHr = [this.signedReportsByHRForCurrentYearCount,
                    this.reportsForCurrentYearCount - this.signedReportsByHRForCurrentYearCount]

                this.HRDataIsLoading = false;
            });
        });

        this.bonusesService.getTotalReportsCount().subscribe((response) => {
            this.reportsCount = response;
        });

        this.bonusesService.getBonusesByYearTop10().subscribe((response) => {
            this.bonuses = response.map(bonus => bonus.totalBonus);
            this.salesmenFullname = response.map(bonus => `${bonus.firstname} ${bonus.lastname}`);

            console.log(this.bonuses)
            console.log(this.salesmenFullname)
            this.top10IsLoading = false;

        });

    }

    fillRejectsStatistics() {
        this.rejectionService.getRejectionsCountByCurrentYear().subscribe((response) => {
            this.rejectionsForCurrentYearCount = response;
        });
    }

    fillUsersStatistics() {
        this.userService.getUsersCount().subscribe((response) => {
            this.usersCount = response;
        });
    }

    fillSalesmanStatistics() {
        this.salesmanService.getSalesmenCount().subscribe((response) => {
            this.salesmenCount = response;
        });
    }

    fillSalesOrdersStatistics() {
        this.salesService.getSalesCountForCurrentYear().subscribe((response) => {
            this.salesForCurrentYearCount = response;
        });
    }
}
