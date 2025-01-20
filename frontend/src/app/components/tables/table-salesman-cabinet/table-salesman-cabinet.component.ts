import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {PaginationInstance} from 'ngx-pagination';
import {Bonuses} from 'src/app/models/Bonuses';
import {RejectionMessage} from '../../../models/RejectionMessage';
import {RejectionService} from '../../../services/rejection.service';
import {BonusesService} from '../../../services/bonuses.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-table-salesman-cabinet',
    templateUrl: './table-salesman-cabinet.component.html',
    styleUrls: ['./table-salesman-cabinet.component.css'],
    animations: [
        trigger('fadeToggle', [
            state('hidden', style({opacity: 1, height: '40px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'})),
            state('visible', style({opacity: 1, height: '*', overflow: 'visible', whiteSpace: 'normal'})),
            transition('hidden => visible', [animate('300ms ease-in-out')]),
            transition('visible => hidden', [
                style({ overflow: 'hidden' }), // Встановлюємо overflow: hidden перед анімацією
                animate('500ms ease-in-out'),
            ]),
        ]),
    ]
})
export class TableSalesmanCabinetComponent implements OnInit {

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

    showDetails(): void {
        this.router.navigate(['bonuses-details'], {
            state: {
                // TODO - bonuses for one salesman
                // bonuses
            }
        }
        );
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
        }
        else if (newState === 'confirm'){
            this.bonusesService.confirmBonusById(bonus[0]._id).subscribe();
            this.rejectionService.deleteRejectionsByReport(bonus[0]._id).subscribe(() =>
                this.stateChanged.emit(true));
        }
    }

    rejectionWindowClosed(done: boolean): void {
        this.isRejectWindowVisible = false;
        if (done) {
            this.stateChanged.emit(true);
        } else{
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
