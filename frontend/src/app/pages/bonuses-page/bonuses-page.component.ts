import {Component, inject, OnInit} from '@angular/core';
import {BonusData} from 'src/app/models/BonusData';
import {Salesman} from '../../models/Salesman';
import {BonusesService} from '../../services/bonuses.service';
import {RejectionMessage} from '../../models/RejectionMessage';
import {RejectionService} from '../../services/rejection.service';
import {UserService} from "../../services/user.service";
import {User} from "../../models/User";
import {SnackBarService} from "../../services/snack-bar.service";

@Component({
    selector: 'app-bonuses-page',
    templateUrl: './bonuses-page.component.html',
    styleUrls: ['./bonuses-page.component.css']
})
export class BonusesPageComponent implements OnInit {

    isCalculationWindowVisible = false;
    year: number = new Date().getFullYear();
    user: User;
    bonusesData: BonusData[] = [];
    rejectionData: RejectionMessage[] = [];
    salesmen: Salesman[] = [];
    private bonusesService = inject(BonusesService);
    private rejectionService = inject(RejectionService);
    private userService = inject(UserService);
    private snackBar = inject(SnackBarService);

    updatedChanges: { _id: string; originalValue: boolean; currentValue: boolean }[] = [];


    handleChanges(changes: { _id: string; originalValue: boolean; currentValue: boolean }[]): void {
        this.updatedChanges = changes.filter(change => change.originalValue !== change.currentValue);
    }

    public ngOnInit(): void {
        this.loadBonuses();
        this.fetchUser();
    }

    calculateBonuses(): void {
        this.isCalculationWindowVisible = true;
    }

    saveSelected(): void {
        const changedIds = this.updatedChanges.map(change => change._id);
        this.bonusesService.reverseConfirmArrayOfIds(changedIds).subscribe(() => {
            this.updatedChanges = [];
            // this.bonusesData = [];
            this.loadBonuses();
            this.snackBar.showSnackBar('Selected bonuses was saved successfully');
        },
            (): void => this.snackBar.showSnackBar('Selected bonuses was not saved'));
    }

    updateTable($event: boolean): void {
        this.loadBonuses();
    }

    loadBonuses(): void {
        this.bonusesService.getBonusesByYear(this.year).subscribe((response) => {
            this.bonusesData = response;
        }, (): void => this.snackBar.showSnackBar('Error loading bonuses data'));
        this.rejectionService.getRejectionsByYear(this.year).subscribe((response) => {
            this.rejectionData = response;
        }, (): void => this.snackBar.showSnackBar('Error loading rejection data'));
    }

    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }
}
