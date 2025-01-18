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
    isAddSocialPerformanceWindowVisible = false;
    private userService: UserService = inject(UserService);
    private salesmanService: SalesmanService = inject(SalesmanService);
    private bonusesService = inject(BonusesService);
    private salesService = inject(SalesService);
    private socialService = inject(SocialPerformanceService);
    private rejectionService = inject(RejectionService);

    ngOnInit(): void {
        this.fetchUser();
    }

    toAddSocialPerformanceRecord() {

    }

    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
            this.fetchSalesman(user.code);
            this.fetchBonuses(user.code);
            this.fetchRejections(user.code);
            this.fetchSaleRecords(user.code);
            this.fetchSocialRecords(user.code);
        });
    }

    fetchSalesman(code: number): void {
        this.salesmanService.getSalesmanByCode(code).subscribe((value): void => {
            this.salesman = value;
        });
    }

    fetchBonuses(code: number): void {
        this.bonusesService.getBonusesBySalesmanCode(code).subscribe((value): void => {
            this.bonuses = value.sort((a, b): number => b.year - a.year);
        });
    }

    fetchRejections(code: number): void {
        this.rejectionService.getRejectionsForSalesman(code).subscribe((value): void => {
            this.rejectionMessages = value;
        });
    }

    fetchSaleRecords(code: number): void {
        this.salesService.getSalePerformRecordsBySalesmanCode(code).subscribe((value): void => {
            this.saleRecords = value.sort((a, b): number => b.activeYear - a.activeYear);
        });
    }

    fetchSocialRecords(code: number): void {
        this.socialService.getSocialPerformancesRecordBySalesmanCode(code).subscribe((value): void => {
            this.socialRecords = value.sort((a, b): number => b.year - a.year);
        });
    }

    confirmationBySalesmanChanged(newState: boolean): void {
        this.bonusesService.getBonusesBySalesmanCode(this.salesman.code).subscribe((value): void => {
            this.bonuses = value;
        });
        this.rejectionService.getRejectionsForSalesman(this.salesman.code).subscribe((value): void => {
            this.rejectionMessages = value;
        });
    }
}
