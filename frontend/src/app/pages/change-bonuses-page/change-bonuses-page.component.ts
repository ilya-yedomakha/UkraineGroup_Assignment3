import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {BonusData} from 'src/app/models/BonusData';
import {User} from 'src/app/models/User';
import {UserService} from 'src/app/services/user.service';
import {BonusesService} from "../../services/bonuses.service";
import {SnackBarService} from "../../services/snack-bar.service";


@Component({
    selector: 'app-change-bonuses-page',
    templateUrl: './change-bonuses-page.component.html',
    styleUrls: ['./change-bonuses-page.component.css']
})
export class ChangeBonusesPageComponent implements OnInit {

    bonusesData: BonusData;
    user: User;
    buttonConfirmText: string;
    @Output() dataChange = new EventEmitter<boolean>();
    private userService: UserService = inject(UserService);
    private bonusesService = inject(BonusesService);
    private snackBar = inject(SnackBarService);
    dropToInitialLoading: boolean = false;
    updatingConfirmRemarkIsLoading: boolean = false;
    HRMSendLoading: boolean = false;
    currentYear = new Date().getFullYear();


    public ngOnInit(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
            this.findCurrentConfirmationButtonText();
        });
        this.bonusesData = history.state.bonuse;

    }

    findCurrentConfirmationButtonText() {
        switch (this.user.role) {
            case 0:
                if (this.bonusesData.isConfirmedByCEO) {
                    this.buttonConfirmText = "Un-confirm bonuses"
                } else {
                    this.buttonConfirmText = "Confirm bonuses"
                }
                break;
            case 1:
                if (this.bonusesData.isConfirmedByHR) {
                    this.buttonConfirmText = "Un-confirm social data"
                } else {
                    this.buttonConfirmText = "Confirm social data"
                }
                break;
        }
    }

    getTotalBonuses(bonuses: BonusData): number {
        const ordersBonusesSum = bonuses.ordersBonuses.reduce((sum, ob) => Number(sum) + Number(ob.bonus), 0);
        const socialBonusesSum = bonuses.socialBonuses.reduce((sum, ob) => Number(sum) + Number(ob.bonus), 0);
        return ordersBonusesSum + socialBonusesSum;
    }

    saveAll(): void {
        const updatedBonuses = {
            socialBonuses: this.bonusesData.socialBonuses,
            ordersBonuses: this.bonusesData.ordersBonuses,
            remarks: this.bonusesData.remarks
        };

        this.bonusesService.saveNewOrderBonuses(this.bonusesData._id, updatedBonuses).subscribe({
            next: (): void => {
                this.bonusesData.isConfirmedBySalesman = false;
                this.bonusesData.isRemarkConfirmedByHR = false;
                this.updateData();
                this.dataChange.emit(true);
                this.snackBar.showSnackBar('Remarks, order and social bonuses have been successfully saved');
            },
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }

    recalculateSingleBonus(): void {
        this.bonusesService.recalculateSingleBonus(this.bonusesData._id).subscribe({
            next: (response): void => {
                this.bonusesData = response;
                this.updateData();
                this.dataChange.emit(true);
                this.snackBar.showSnackBar('Bonuses were recalculated successfully!');
                this.findCurrentConfirmationButtonText()
            },
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }

    singleConfirm(): void {
        this.bonusesService.singleConfirm(this.bonusesData._id).subscribe({
            next: (response): void => {
                this.user.role === 0 ? this.bonusesData.isConfirmedByCEO = !this.bonusesData.isConfirmedByCEO : this.bonusesData.isConfirmedByHR = !this.bonusesData.isConfirmedByHR;
                this.dataChange.emit(true);
                this.bonusesData = response;
                let message: string;
                if (this.user.role === 0) {
                    message = this.bonusesData.isConfirmedByCEO ? 'confirmed' : 'unconfirmed';
                } else {
                    message = this.bonusesData.isConfirmedByHR ? 'confirmed' : 'unconfirmed';
                }
                this.snackBar.showSnackBar('Bonuses have been successfully ' + message + '!');
                this.findCurrentConfirmationButtonText()
                this.updateData();
            },
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }

    saveRemarks(): void {
        const updatedBonuses = {
            remarks: this.bonusesData.remarks
        };

        this.bonusesService.saveNewOrderBonuses(this.bonusesData._id, updatedBonuses).subscribe({
            next: (): void => {
                this.bonusesData.isConfirmedBySalesman = false;
                this.bonusesData.isRemarkConfirmedByHR = false;
                this.updateData();
                this.dataChange.emit(true);
                this.snackBar.showSnackBar('Remarks saved');
            },
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }

    updateData(): void {
        const updatedState = {
            ...history.state,
            bonuse: this.bonusesData,
        };

        history.replaceState(updatedState, '');
    }

    dropToInitialBonuses() {
        this.dropToInitialLoading = true;
        this.bonusesData.ordersBonuses.forEach(order => order.bonus = order.initialBonus);
        this.bonusesData.socialBonuses.forEach(sale => sale.bonus = sale.initialBonus);
        this.dropToInitialLoading = false;
        this.snackBar.showSnackBar('Bonuses have been reset to their initial value');
    }

    confirmRemark() {
        this.updatingConfirmRemarkIsLoading = true
        this.bonusesService.singleRemarkConfirmAndEmailSend(this.bonusesData._id).subscribe({
            next: (): void => {
                this.updatingConfirmRemarkIsLoading = false;
                this.bonusesData.isRemarkConfirmedByHR = true;
                this.dataChange.emit(true);
                this.snackBar.showSnackBar('Remark has been successfully confirmed and an email was sent to a corresponding salesman!');
                this.updateData();
            },
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }

    updateOldHRMBonusById() {
        this.HRMSendLoading = true;
        this.bonusesService.updateOldHRMBonusById(this.bonusesData._id).subscribe({
            next: (): void => {
                this.bonusesData.isSent = true;
                this.HRMSendLoading = false;
                this.snackBar.showSnackBar("Bonus was sent to HRM!");
            },
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }
}
