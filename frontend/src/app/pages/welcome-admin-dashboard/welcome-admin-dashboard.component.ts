import {Component, inject, OnInit} from '@angular/core';
import {BonusesService} from "../../services/bonuses.service";
import {UserService} from 'src/app/services/user.service';
import {SalesmanService} from 'src/app/services/salesman.service';
import {User} from 'src/app/models/User';
import {RejectionService} from "../../services/rejection.service";
import {SalesService} from "../../services/sales.service";
import {SnackBarService} from "../../services/snack-bar.service";

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

    signatureByPieLabel = "Number of bonuses"
    numberOfSignaturesByCeo: [number, number];
    numberOfSignaturesByHr: [number, number];
    signatureByCeoPieLabels: string[] = ["Number of confirmed bonuses by CEO", "Number of unconfirmed bonuses by CEO"]
    signatureByHrPieLabels: string[] = ["Number of confirmed bonuses by HR", "Number of unconfirmed bonuses by HR"]

    bonuses: number[]
    salesmenFullname: string[]

    private bonusesService = inject(BonusesService);
    private userService: UserService = inject(UserService);
    private salesmanService: SalesmanService = inject(SalesmanService);
    private salesService: SalesService = inject(SalesService);
    private rejectionService: RejectionService = inject(RejectionService);
    private snackBar = inject(SnackBarService);
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
        this.updatingIsLoading = true;

        this.salesmanService.importSeniorSalesmenFromOrangeHRM().subscribe({
            next: () => {
                this.salesService.importSalesOrdersFromOpenCRX().subscribe({
                    next: () => {
                        this.updatingIsLoading = false;
                        this.snackBar.showSnackBar('Data were updated successfully.');
                    },
                    error: (err): void => {
                        this.updatingIsLoading = false;
                        this.snackBar.showSnackBar('Error: ' + err.error?.message);
                    }
                });
            },
            error: (err): void => {
                this.updatingIsLoading = false;
                this.snackBar.showSnackBar('Error: ' + err.error?.message);
            }
        });
    }

    sendAllBonusesToHRM() {
        this.updatingSendIsLoading = true;

        this.bonusesService.sendAllBonusesToHRM().subscribe({
            next: (response) => {
                this.updatingSendIsLoading = false;
                console.log(response);
                this.snackBar.showSnackBar(response.message);
            },
            error: (err): void => {
                this.updatingSendIsLoading = false;
                this.snackBar.showSnackBar('Error: ' + err.error?.message);
            },
        });
    }

    fetchUser() {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }

    fillReportsStatistics() {
        this.bonusesService.getTotalReportsForCurrentYear().subscribe({
            next: (response) => {
                this.reportsForCurrentYearCount = response;

                this.bonusesService.getSignedByCEOReportsCountForCurrentYear().subscribe({
                    next: (response) => {
                        this.signedReportsByCEOForCurrentYearCount = response;
                        this.numberOfSignaturesByCeo = [this.signedReportsByCEOForCurrentYearCount,
                            this.reportsForCurrentYearCount - this.signedReportsByCEOForCurrentYearCount]

                        this.CEODataIsLoading = false;
                    },
                    error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
                });

                this.bonusesService.getSignedByHRReportsCountForCurrentYear().subscribe({
                    next: (response) => {
                        this.signedReportsByHRForCurrentYearCount = response;
                        this.numberOfSignaturesByHr = [this.signedReportsByHRForCurrentYearCount,
                            this.reportsForCurrentYearCount - this.signedReportsByHRForCurrentYearCount]

                        this.HRDataIsLoading = false;
                    },
                    error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
                });
            },
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });

        this.bonusesService.getTotalReportsCount().subscribe({
            next: (response) => this.reportsCount = response,
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });

        this.bonusesService.getBonusesByYearTop10().subscribe({
            next: (response) => {
                this.bonuses = response.map(bonus => bonus.totalBonus);
                this.salesmenFullname = response.map(bonus => `${bonus.firstname} ${bonus.lastname}`);
                this.top10IsLoading = false;
            },
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }

    fillRejectsStatistics() {
        this.rejectionService.getRejectionsCountByCurrentYear().subscribe({
            next: (response) => this.rejectionsForCurrentYearCount = response,
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }

    fillUsersStatistics() {
        this.userService.getUsersCount().subscribe({
            next: (response) => this.usersCount = response,
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }

    fillSalesmanStatistics() {
        this.salesmanService.getSalesmenCount().subscribe({
            next: (response) => this.salesmenCount = response,
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }

    fillSalesOrdersStatistics() {
        this.salesService.getSalesCountForCurrentYear().subscribe({
            next: (response) => this.salesForCurrentYearCount = response,
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }
}
