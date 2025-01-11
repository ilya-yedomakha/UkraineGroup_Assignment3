import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { BonusData } from 'src/app/models/BonusData';

@Component({
    selector: 'app-table-salesmen-bonuses',
    templateUrl: './table-salesmen-bonuses.component.html',
    styleUrls: ['./table-salesmen-bonuses.component.css']
})
export class TableSalesmenBonusesComponent  implements OnInit{

    @Input() bonuses: BonusData[];
    @Output() changesDetected = new EventEmitter<{ _id: string, originalValue: boolean, currentValue: boolean }[]>();
    changes: { _id: string, originalValue: boolean, currentValue: boolean }[] = [];
    currentPage = 1;
    itemsPerPage = 8;
    totalItems = 0;


    constructor(private router: Router){}

    public pagingConfig: PaginationInstance = {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        totalItems: this.totalItems
    };

    ngOnInit(): void {
        this.totalItems = this.bonuses.length;
        this.changes = this.bonuses.map(bonus => ({
          _id: bonus._id,
          originalValue: bonus.isConfirmedByCEO,
          currentValue: bonus.isConfirmedByCEO,
        }));
    }

    toEditSalesmanBonus(bonuse: BonusData){
        this.router.navigate(['edit-bonuses'], {
            state: {
                bonuse : bonuse
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

    onCheckboxChange(bonusId: string, newValue: boolean) {
      const change = this.changes.find(change => change._id === bonusId);
      if (change) {
        change.currentValue = newValue;
        this.changesDetected.emit(this.changes);
      }
    }

}
