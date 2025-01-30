import {Component, inject, OnInit} from '@angular/core';
import {Bonuses} from 'src/app/models/Bonuses';
import {SalePerformanceRecord} from 'src/app/models/SalePerformanceRecord';
import {Salesman} from 'src/app/models/Salesman';
import {SocialPerformanceRecord} from 'src/app/models/SocialPerformanceRecord';
import {User} from 'src/app/models/User';
import {UserService} from '../../services/user.service';
import {BonusesService} from '../../services/bonuses.service';
import {RejectionMessage} from '../../models/RejectionMessage';
import {RejectionService} from '../../services/rejection.service';
import {SalesmanService} from '../../services/salesman.service';
import {SalesService} from '../../services/sales.service';
import {SocialPerformanceService} from '../../services/social-performance.service';
import {ActivatedRoute} from '@angular/router';
import {SnackBarService} from "../../services/snack-bar.service";

@Component({
    selector: 'app-salesman-cabinet-page',
    templateUrl: './salesman-cabinet-page.component.html',
    styleUrls: ['./salesman-cabinet-page.component.css']
})
export class SalesmanCabinetPageComponent implements OnInit {

    user: User;
    salesman: Salesman;
    bonuses: Bonuses[];
    rejectionMessages: RejectionMessage[];
    socialRecords: SocialPerformanceRecord[];
    saleRecords: SalePerformanceRecord[];
    isAddSocialPerformanceWindowVisible: boolean = false;
    isPasswordChangeWindowIsVisible: boolean = false;

    code: number;
    private userService: UserService = inject(UserService);
    private salesmanService: SalesmanService = inject(SalesmanService);
    private bonusesService = inject(BonusesService);
    private salesService = inject(SalesService);
    private socialService = inject(SocialPerformanceService);
    private rejectionService = inject(RejectionService);
    private snackBarService = inject(SnackBarService);

    constructor(private activateRoute: ActivatedRoute) {
        this.code = Number(activateRoute.snapshot.paramMap.get('code'));
    }

    ngOnInit(): void {
        this.fetchUser();
    }

    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
            const codeToUse = this.code === 0 ? user.code : this.code;
            this.fetchSalesman(codeToUse);
            this.fetchBonuses(codeToUse);
            this.fetchRejections(codeToUse);
            this.fetchSaleRecords(codeToUse);
            this.fetchSocialRecords(codeToUse);
        });
    }

    fetchSalesman(code: number): void {
        this.salesmanService.getSalesmanByCode(code).subscribe({
            next: (value): void => {
                this.salesman = value;
            },
            error: (err): void => this.snackBarService.showSnackBar('Error: ' + err.error?.message),
        });
    }

    fetchBonuses(code: number): void {
        this.bonusesService.getBonusesBySalesmanCode(code).subscribe({
            next: (value): void => {
                this.bonuses = value.sort((a, b): number => b.year - a.year);
            },
            error: (err): void => this.snackBarService.showSnackBar('Error: ' + err.error?.message),
        });
    }

    fetchRejections(code: number): void {
        this.rejectionService.getRejectionsForSalesman(code).subscribe({
            next: (value): void => this.rejectionMessages = value,
            error: (err): void => this.snackBarService.showSnackBar('Error: ' + err.error?.message),
        });
    }

    fetchSaleRecords(code: number): void {
        this.salesService.getSalePerformRecordsBySalesmanCode(code).subscribe({
            next: (value): void => {
                this.saleRecords = value.sort((a, b): number => b.activeYear - a.activeYear);
            },
            error: (err): void => this.snackBarService.showSnackBar('Error: ' + err.error?.message),
        });
    }

    fetchSocialRecords(code: number): void {
        this.socialService.getSocialPerformancesRecordBySalesmanCode(code).subscribe({
            next: (value): void => {
                this.socialRecords = value.sort((a, b): number => {
                    if (a.year !== b.year) {
                        return b.year - a.year;
                    }
                    return a.goal_description.localeCompare(b.goal_description);
                });
            },
            error: (err): void => this.snackBarService.showSnackBar('Error: ' + err.error?.message),
        });
    }

    confirmationBySalesmanChanged(newState: boolean): void {
        this.bonusesService.getBonusesBySalesmanCode(this.salesman.code).subscribe({
            next: (value) => this.bonuses = value,
            error: (err): void => this.snackBarService.showSnackBar('Error: ' + err.error?.message),
        });
        this.rejectionService.getRejectionsForSalesman(this.salesman.code).subscribe({
            next: (value) => this.rejectionMessages = value,
            error: (err): void => this.snackBarService.showSnackBar('Error: ' + err.error?.message),
        });
    }

    handleSocialPerformanceAddition(isAdded: boolean): void {
        this.isAddSocialPerformanceWindowVisible = false;
        if (isAdded) {
            this.fetchSocialRecords(this.code);
        }
    }

    reFetchSocialRecords(updated: boolean): void {
        if (updated) {
            this.fetchSocialRecords(this.code);
        }
    }

    isAllSocialPerformanceRecordsCreated(): boolean {
        return this.socialRecords.filter(value => value.year === new Date().getFullYear()).length < 6;
    }
}
