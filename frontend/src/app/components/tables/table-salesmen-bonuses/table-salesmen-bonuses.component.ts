import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { BonusData } from 'src/app/models/BonusData';
import {RejectionMessage} from '../../../models/RejectionMessage';
import {animate, state, style, transition, trigger} from '@angular/animations';

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
    @Input() rejectionData: RejectionMessage[];
    @Output() changesDetected = new EventEmitter<{ _id: string; originalValue: boolean; currentValue: boolean }[]>();
    changes: { _id: string; originalValue: boolean; currentValue: boolean }[] = [];
    currentPage = 1;
    itemsPerPage = 8;
    totalItems = 0;
    isClicked = false;
    rejectionMessage: RejectionMessage;

    constructor(private router: Router){}

    public pagingConfig: PaginationInstance = {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        totalItems: this.totalItems
    };

    // ngOnInit(): void {
    //     this.totalItems = this.bonuses.length;
    //     // console.log(this.bonuses.length);
    //     this.changes = this.bonuses.map(bonus => ({
    //         _id: bonus._id,
    //         originalValue: bonus.isConfirmedByCEO,
    //         currentValue: bonus.isConfirmedByCEO,
    //     }));
    //     // console.log(this.changes);
    // }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.bonuses) {
            this.changes = this.bonuses.map(bonus => ({
                _id: bonus._id,
                originalValue: bonus.isConfirmedByCEO,
                currentValue: bonus.isConfirmedByCEO,
            }));
        }
    }

    toEditSalesmanBonus(bonus: BonusData): void{
        this.router.navigate(['edit-bonuses'], {
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
        this.changesDetected.emit(this.changes);
    }

    hasRejectionForBonus(bonusId: string): boolean {
        const rejections = this.rejectionData.filter(value => value.report_id === bonusId);
        if (rejections && rejections.length > 0) {
            this.rejectionMessage = rejections[0];
        }
        return rejections && rejections.length > 0;
    }
}
