import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {BonusData} from 'src/app/models/BonusData';
import {PaginationInstance} from 'ngx-pagination';
import {BonusesService} from "../../../services/bonuses.service";
import {SnackBarService} from "../../../services/snack-bar.service";

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

    filterName: string = "";
    filterTargetValue: number | null = null;
    filterActualValue: number | null = null;

    snackBarService = inject(SnackBarService);
    bonuse = {bonus: 0};


    handleBonusChange(bonuse: any): void {
        if (bonuse.bonus === '' || bonuse.bonus === null || isNaN(Number(bonuse.bonus))) {
            bonuse.bonus = 0;
        } else {
            const parsedValue = Number(bonuse.bonus);
            bonuse.bonus = parsedValue < 0 ? 0 : parsedValue;
        }
    }

    preventNegativeSign(event: KeyboardEvent): void {
        if (event.key === '-') {
            event.preventDefault();
        }
    }

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
        this.bonusesService.saveNewOrderBonuses(this.bonuses._id, newBonus).subscribe({
            next: () => {
                this.dataChange.emit(true);
                this.snackBarService.showSnackBar("Saved new sales bonuses!");
            },
            error: (err): void => this.snackBarService.showSnackBar("Error: " + err.error?.message)
        });
    }

    cancelEdit(bonus: any, index: number) {
        bonus.bonus = this.originalSocialBonuses[index];
        this.isEditing[index] = false;
    }

    saveEdit(index: number, newBonus: number) {
        this.isEditing[index] = false;
        this.originalSocialBonuses[index] = newBonus;
        this.snackBarService.showSnackBar("New social bonus value assigned");
    }

    clearFiltersInputs() {
        this.filterName = "";
        this.filterActualValue = null;
        this.filterTargetValue = null;
    }

}

