import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { BonusData } from 'src/app/models/BonusData';

@Component({
    selector: 'app-table-salesmen-bonuses',
    templateUrl: './table-salesmen-bonuses.component.html',
    styleUrls: ['./table-salesmen-bonuses.component.css']
})
export class TableSalesmenBonusesComponent  implements OnChanges{

    @Input() bonuses: BonusData[];
    @Output() changesDetected = new EventEmitter<{ _id: string; originalValue: boolean; currentValue: boolean }[]>();
    changes: { _id: string; originalValue: boolean; currentValue: boolean }[] = [];
    currentPage = 1;
    itemsPerPage = 8;
    totalItems = 0;


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
        if (changes['bonuses']) {
            this.changes = this.bonuses.map(bonus => ({
                _id: bonus._id,
                originalValue: bonus.isConfirmedByCEO,
                currentValue: bonus.isConfirmedByCEO,
            }));
        }
    }

    toEditSalesmanBonus(bonuse: BonusData){
        this.router.navigate(['edit-bonuses'], {
            state: {
                bonuse
            }
        }

        );
    }

    onTableDataChange(event: any){
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
                originalValue: false, // Якщо значення немає, встановіть за замовчуванням
                currentValue: newValue
            });
        }
        this.changesDetected.emit(this.changes);
    }


}
