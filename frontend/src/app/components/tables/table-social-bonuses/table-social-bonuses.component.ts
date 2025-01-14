import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {BonusData} from 'src/app/models/BonusData';
import {PaginationInstance} from 'ngx-pagination';
import {BonusesService} from "../../../services/bonuses.service";

@Component({
    selector: 'app-table-social-bonuses',
    templateUrl: './table-social-bonuses.component.html',
    styleUrls: ['./table-social-bonuses.component.css']
})
export class TableSocialBonusesComponent implements OnInit {

    @Input() bonuses: BonusData;
    @Input() userRole!: 0 | 1 | 2;
    @Output() dataChange = new EventEmitter<boolean>();
    currentPage = 1;
    itemsPerPage = 8;
    totalItems = 0;

    private bonusesService = inject(BonusesService);

    originalSocialBonuses: number[] = [];
    isEditing: boolean[] = [];

    public pagingConfig: PaginationInstance = {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        totalItems: this.totalItems
    };

    ngOnInit(): void {
        this.totalItems = this.bonuses.socialBonuses.length;
        this.originalSocialBonuses = this.bonuses.socialBonuses.map(el => el.bonus);
        this.isEditing = this.bonuses.socialBonuses.map(() => false);
    }


    getSocialBonusesTotal(): number {
        return parseInt(this.bonuses.socialBonuses.reduce((sum, ob) => Number(sum) + Number(ob.bonus), 0).toString());
    }

    onTableDataChange(event: any) {
        this.pagingConfig.currentPage = event;
    }

    onTableSizeChange(event: any): void {
        this.pagingConfig.itemsPerPage = event.target.value;
        this.pagingConfig.currentPage = 1;
    }

    saveSocialBonuses() {
        let newBonus: any = {
            "socialBonuses": this.bonuses.socialBonuses
        };
        this.bonusesService.saveNewOrderBonuses(this.bonuses._id, newBonus).subscribe(() => {
            this.dataChange.emit(true);
        });
    }

    cancelEdit(bonuse: any, index: number) {
        const originalBonus = this.originalSocialBonuses[index]
        bonuse.bonus = originalBonus;
        this.isEditing[index] = false;
    }

    saveEdit(index: number, newBonus: number) {
        this.isEditing[index] = false;
        this.originalSocialBonuses[index] = newBonus;
    }

}

