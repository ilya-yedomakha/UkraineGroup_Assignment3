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

        //TODO(чому назва метода saveSocialAndOrderBonuses а зберігаєтсья saveNewOrderBonuses)
        this.bonusesService.saveNewOrderBonuses(this.bonusesData._id, updatedBonuses).subscribe(() => {
            this.updateData();
            this.dataChange.emit(true);
            this.snackBar.showSnackBar('Order and social bonuses have been successfully saved');
        }, (): void => this.snackBar.showSnackBar('Error occurred while saving your order'));
    }

    recalculateSingleBonus(): void {
        this.bonusesService.recalculateSingleBonus(this.bonusesData._id).subscribe((response) => {
            this.bonusesData = response;
            this.updateData();
            this.dataChange.emit(true);
            this.snackBar.showSnackBar('Bonuses were recalculated successfully!');
            this.findCurrentConfirmationButtonText()
        }, (): void => this.snackBar.showSnackBar('Error occurred while recalculating'));
    }

    singleConfirm(): void {
        this.bonusesService.singleConfirm(this.bonusesData._id).subscribe((response) => {
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
        }, (): void => this.snackBar.showSnackBar('Error occurred while confirmation'));
    }

    saveRemarks(): void {
        const updatedBonuses = {
            remarks: this.bonusesData.remarks
        };

        this.bonusesService.saveNewOrderBonuses(this.bonusesData._id, updatedBonuses).subscribe(() => {
            this.updateData();
            this.dataChange.emit(true);
            this.snackBar.showSnackBar('Remarks saved');
        }, (): void => this.snackBar.showSnackBar('Error occurred while saving remarks!'));
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
        this.bonusesService.singleRemarkConfirmAndEmailSend(this.bonusesData._id).subscribe(() => {
            this.updatingConfirmRemarkIsLoading = false;
            this.dataChange.emit(true);
            this.snackBar.showSnackBar('Remark has been successfully confirmed and an email was sent to a corresponding salesman!');
            this.updateData();
        }, (): void => this.snackBar.showSnackBar('Error occurred while confirming remark'));
    }

    updateOldHRMBonusById(){
        this.HRMSendLoading = true;
        this.bonusesService.updateOldHRMBonusById(this.bonusesData._id).subscribe(() => {
            this.bonusesData.isSent = true;
            this.HRMSendLoading = false;
            this.snackBar.showSnackBar("Bonus was sent to HRM!");
        }, (): void => this.snackBar.showSnackBar('Error occurred while updating bonus in HRM'));
    }
}
