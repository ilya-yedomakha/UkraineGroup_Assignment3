import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';
import {BonusData} from 'src/app/models/BonusData';
import {BonusesService} from "../../../services/bonuses.service";

@Component({
    selector: 'app-table-orders-bonuses',
    templateUrl: './table-orders-bonuses.component.html',
    styleUrls: ['./table-orders-bonuses.component.css']
})
export class TableOrdersBonusesComponent implements OnInit {

    @Input() bonuses: BonusData;
    @Input() userRole!: 0 | 1 | 2;
    @Output() dataChange = new EventEmitter<boolean>();
    currentPage = 1;
    itemsPerPage = 8;
    totalItems = 0;

    private bonusesService = inject(BonusesService);

    originalOrderBonuses: number[] = []
    isEditing: boolean[] = []

    public pagingConfig: PaginationInstance = {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        totalItems: this.totalItems
    };

    ngOnInit(): void {
        this.totalItems = this.bonuses.ordersBonuses.length;
        this.originalOrderBonuses = this.bonuses.ordersBonuses.map(el => el.bonus);
        this.isEditing = this.bonuses.ordersBonuses.map(() => false);
    }

    getOrderBonusesTotal(): number {
        return parseInt(this.bonuses.ordersBonuses.reduce((sum, ob) => Number(sum) + Number(ob.bonus), 0).toString());
    }

    onTableDataChange(event: any) {
        this.pagingConfig.currentPage = event;
    }

    onTableSizeChange(event: any): void {
        this.pagingConfig.itemsPerPage = event.target.value;
        this.pagingConfig.currentPage = 1;
    }

    saveSalesBonuses() {
        let newBonus: any = {
            "ordersBonuses" : this.bonuses.ordersBonuses
        };
        this.bonusesService.saveNewOrderBonuses(this.bonuses._id, newBonus).subscribe(() => {
            this.dataChange.emit(true);
        });
    }

    cancelEdit(bonuse: any, index: number) {
        const originalBonus = this.originalOrderBonuses[index]
        bonuse.bonus = originalBonus;
        this.isEditing[index] = false;
    }

    saveEdit(index: number, newBonus: number) {
        this.isEditing[index] = false;
        this.originalOrderBonuses[index] = newBonus;
    }

}
