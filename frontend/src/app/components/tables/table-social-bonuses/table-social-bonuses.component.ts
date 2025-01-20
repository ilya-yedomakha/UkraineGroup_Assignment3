import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {BonusData} from 'src/app/models/BonusData';
import {PaginationInstance} from 'ngx-pagination';
import {BonusesService} from "../../../services/bonuses.service";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

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

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    snackBar = inject(MatSnackBar);
    bonuse = { bonus: 0 };

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
        this.bonusesService.saveNewOrderBonuses(this.bonuses._id, newBonus).subscribe(() => {
            this.dataChange.emit(true);
            this.showSnackBar("Saved new sales bonuses!");
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
        this.showSnackBar("New social bonus value assigned");
    }

    showSnackBar(message: string): void {
        const durationInSeconds = 5000;
        this.snackBar.open(message, 'Ok', {
            duration: durationInSeconds,
            panelClass: 'main-snackbar',
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

}

