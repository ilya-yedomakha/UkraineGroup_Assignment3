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
    private bonusesService = inject(BonusesService);
    private rejectionService = inject(RejectionService);

    ngOnInit(): void {
        this.fetchUser();
        // service!!
        this.salesman = new Salesman(90732, 'fsdf', 'fdsfsd', 'fsdfs', 'fds', 'fsdfs', 'fsdfs', 'fdsfsf', 'fdsfs', 'fsdfsfs', 'fdsfs', 'fdsfs');
        this.bonusesService.getBonusesBySalesmanCode(90732).subscribe(value => {
            this.bonuses = value;
        });
        this.rejectionService.getRejectionsForSalesman(this.salesman.code).subscribe(value => {
            this.rejectionMessages = value;
        });
        this.socialRecords = [
            new SocialPerformanceRecord('Some_1', 5, 4, 2025, 3456),
            new SocialPerformanceRecord('Some_2', 5, 4, 2025, 3456)
        ];

        this.saleRecords = [
            new SalePerformanceRecord('sdffffds', 2024, 4, 234, 'fdsfdsfsd', 4, 432, 'Eggs', 32, 342, 23, 'some', 23, 43, 43, 'Product'),
            new SalePerformanceRecord('sdffffds', 2025, 4, 234, 'fdsfdsfsd', 4, 432, 'Eggs2', 32, 32, 24, 'some', 23, 43, 45, 'Product1')
        ];
    }

    toAddSocialPerformanceRecord() {

    }

    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }

    confirmationBySalesmanChanged(newState: boolean): void {
        this.bonusesService.getBonusesBySalesmanCode(90732).subscribe(value => {
            this.bonuses = value;
        });
        this.rejectionService.getRejectionsForSalesman(this.salesman.code).subscribe(value => {
            this.rejectionMessages = value;
        });
    }
}
