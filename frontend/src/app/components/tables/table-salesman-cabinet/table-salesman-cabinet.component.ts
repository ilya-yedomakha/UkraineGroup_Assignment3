import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {PaginationInstance} from 'ngx-pagination';
import {Bonuses} from 'src/app/models/Bonuses';
import {User} from 'src/app/models/User';
import {RejectionMessage} from '../../../models/RejectionMessage';
import {RejectionService} from '../../../services/rejection.service';
import {BonusesService} from '../../../services/bonuses.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BonusData} from "../../../models/BonusData";
import {SnackBarService} from "../../../services/snack-bar.service";

@Component({
    selector: 'app-table-salesman-cabinet',
    templateUrl: './table-salesman-cabinet.component.html',
    styleUrls: ['./table-salesman-cabinet.component.css'],
    animations: [
        trigger('fadeToggle', [
            state('hidden', style({
                opacity: 1,
                height: '40px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            })),
            state('visible', style({opacity: 1, height: '*', overflow: 'visible', whiteSpace: 'normal'})),
            transition('hidden => visible', [animate('300ms ease-in-out')]),
            transition('visible => hidden', [
                style({overflow: 'hidden'}), // Встановлюємо overflow: hidden перед анімацією
                animate('500ms ease-in-out'),
            ]),
        ]),
    ]
})
export class TableSalesmanCabinetComponent implements OnInit {

    @Input() user: User;
    @Input() bonuses: Bonuses[];
    @Input() salesmanCode: number;
    @Input() rejectionMessages: RejectionMessage[];
    @Output() stateChanged = new EventEmitter<boolean>();
    previousState: 'confirm' | 'none' | 'reject';
    isRejectWindowVisible = false;
    currentYear: number = new Date().getFullYear();
    currentPage = 1;
    itemsPerPage = 8;
    totalItems = 0;
    isClicked = false;
    isVisible = true;
    rejectionMessage: RejectionMessage;
    private rejectionService = inject(RejectionService);
    private bonusesService = inject(BonusesService);
    private snackBar = inject(SnackBarService);

    public pagingConfig: PaginationInstance = {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        totalItems: this.totalItems
    };

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        this.totalItems = this.bonuses.length;
    }

    onTableDataChange(event: any): void {
        this.pagingConfig.currentPage = event;
    }

    onTableSizeChange(event: any): void {
        this.pagingConfig.itemsPerPage = event.target.value;
        this.pagingConfig.currentPage = 1;
    }

    showDetails(id: string): void {
        this.bonusesService.getBonusById(id).subscribe({
            next: (bonus: BonusData): void => {
                this.router.navigate(['bonuses-details'], {
                        state: {
                            bonuse: bonus
                        }
                    }
                );
            },
            error: (err): void => {
                const errorMessage = err.error?.message;
                this.snackBar.showSnackBar('Error: ' + errorMessage);
            }
        });
    }

    hasRejectionForBonus(id: string): boolean {
        const rejection = this.rejectionMessages.filter(value => value.report_id === id);
        if (rejection && rejection.length > 0) {
            this.rejectionMessage = rejection[0];
        } else {
            this.rejectionMessage = undefined;
        }
        return rejection && rejection.length > 0;
    }

    toggleStateForBonus(isConfirmedBySalesman: boolean): 'confirm' | 'none' | 'reject' {
        if (isConfirmedBySalesman) {
            this.previousState = 'confirm';
        } else if (!isConfirmedBySalesman && this.rejectionMessage === undefined) {
            this.previousState = 'none';
        } else {
            this.previousState = 'reject';
        }
        return this.previousState;
    }

    confirmationBySalesmanChanged(newState: 'confirm' | 'none' | 'reject'): void {
        if (newState === this.previousState) {
            return;
        }
        const bonus = this.bonuses.filter(value => value.year === this.currentYear);
        this.hasRejectionForBonus(bonus[0]._id);
        if (newState === 'reject') {
            this.isRejectWindowVisible = true;
        } else if (newState === 'confirm') {
            this.bonusesService.confirmBonusById(bonus[0]._id).subscribe(() => {
            }, error => {
                this.snackBar.showSnackBar(error.error?.message);
            });
            this.rejectionService.deleteRejectionsByReport(bonus[0]._id).subscribe({
                next: () => {
                    this.stateChanged.emit(true);
                    this.snackBar.showSnackBar('Confirmed successfully');
                },
                error: (err) => this.snackBar.showSnackBar('Error: ' + err.error?.message),
            });
        }
    }

    rejectionWindowClosed(done: boolean): void {
        this.isRejectWindowVisible = false;
        if (done) {
            this.stateChanged.emit(true);
        } else {
            this.reload();
        }
    }

    reload(): void {
        this.isVisible = false;
        setTimeout(() => {
            this.isVisible = true;
        }, 0);
    }
}
