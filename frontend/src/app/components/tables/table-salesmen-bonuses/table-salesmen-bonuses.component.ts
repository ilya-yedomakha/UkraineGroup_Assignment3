import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject} from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { BonusData } from 'src/app/models/BonusData';
import {RejectionMessage} from '../../../models/RejectionMessage';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BonusesService} from "../../../services/bonuses.service";

@Component({
    selector: 'app-table-salesmen-bonuses',
    templateUrl: './table-salesmen-bonuses.component.html',
    styleUrls: ['./table-salesmen-bonuses.component.css'],
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
export class TableSalesmenBonusesComponent  implements OnChanges{
    @Input() bonuses: BonusData[];
    @Input() userRole!: 0 | 1 | 2;
    @Input() rejectionData: RejectionMessage[];
    @Output() changesDetected = new EventEmitter<{ _id: string; originalValue: boolean; currentValue: boolean }[]>();
    changes: { _id: string; originalValue: boolean; currentValue: boolean }[] = [];
    currentPage = 1;
    itemsPerPage = 8;
    totalItems = 0;
    isClicked = false;
    isAllSelected = false;
    rejectionMessage: RejectionMessage;
    private bonusesService = inject(BonusesService);
    filterFirstName: string = "";
    filterLastName: string = "";

    constructor(private router: Router){}

    public pagingConfig: PaginationInstance = {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        totalItems: this.totalItems
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.bonuses) {
            this.changes = this.bonuses.map(bonus => ({
                _id: bonus._id,
                originalValue: this.userRole === 0 ? bonus.isConfirmedByCEO : bonus.isConfirmedByHR,
                currentValue: this.userRole === 0 ? bonus.isConfirmedByCEO : bonus.isConfirmedByHR,
            }));
        }
        this.updateGeneralCheckbox();
    }

    getIsConfirmedActual(id: string): boolean{
        return this.changes.find(value => value._id === id).currentValue;
    }

    toEditSalesmanBonus(bonus: BonusData): void{
        this.router.navigate(['bonuses-details'], {
            state: {
                bonuse: bonus
            }
        });
    }

    toViewSalesmanBonus(bonus){
        this.router.navigate(['bonuses-details'], {
            state: {
                bonuse: bonus
            }
        }

        );
    }

    onTableDataChange(event: any): void {
        this.pagingConfig.currentPage  = event;
    }
    onTableSizeChange(event: any): void {
        this.pagingConfig.itemsPerPage = event.target.value;
        this.pagingConfig.currentPage = 1;
    }

    onCheckboxChange(bonusId: string, newValue: boolean): void {
        const change = this.changes.find(change => change._id === bonusId);
        if (change) {
            change.currentValue = newValue;
        } else {
            this.changes.push({
                _id: bonusId,
                originalValue: false,
                currentValue: newValue
            });
        }
        this.updateGeneralCheckbox();
        this.changesDetected.emit(this.changes);
    }

    onGeneralCheckboxChange(newValue: boolean): void {
        this.changes.forEach(change => {
            if(this.userRole === 0 || !this.bonuses.find(bonus => bonus._id === change._id).isConfirmedByCEO) {
                change.currentValue = newValue;
            }
        });
        this.changesDetected.emit(this.changes);
    }

    updateGeneralCheckbox(): void{
        let flag = true;
        this.changes.map(change => {
            if (!change.currentValue){
                flag = false;
                return;
            }
        });
        this.isAllSelected = flag;
    }

    hasRejectionForBonus(bonusId: string): boolean {
        const rejections = this.rejectionData.filter(value => value.report_id === bonusId);
        if (rejections && rejections.length > 0) {
            this.rejectionMessage = rejections[0];
        }
        return rejections && rejections.length > 0;
    }

    clearFiltersInputs() {
        this.filterFirstName = "";
        this.filterLastName = "";
        }
}
