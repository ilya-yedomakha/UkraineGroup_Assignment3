import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {BonusData} from 'src/app/models/BonusData';
import {User} from 'src/app/models/User';
import {UserService} from 'src/app/services/user.service';
import {BonusesService} from "../../services/bonuses.service";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {CustomSnackBarComponent} from "../../components/popouts/custom-snack-bar/custom-snack-bar.component";


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
    snackBar = inject(MatSnackBar);
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

    fetchUser(): void {

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
            this.showSnackBar("Order and social bonuses have been successfully saved");
        });
    }

    recalculateSingleBonus(): void {
        this.bonusesService.recalculateSingleBonus(this.bonusesData._id).subscribe((response) => {
            this.bonusesData = response;
            console.log(response);
            console.log(this.bonusesData);
            this.updateData();
            this.dataChange.emit(true);
            this.showSnackBar("Bonuses were recalculated successfully!");
        })
    }

    singleConfirm(): void {
        this.bonusesService.singleConfirm(this.bonusesData._id).subscribe((response) => {
            this.user.role === 0 ? this.bonusesData.isConfirmedByCEO = !this.bonusesData.isConfirmedByCEO : this.bonusesData.isConfirmedByHR = !this.bonusesData.isConfirmedByHR;
            this.dataChange.emit(true);
            this.bonusesData = response;
            console.log(response)
            this.showSnackBar("Bonuses have been successfully confirmed");
            this.findCurrentConfirmationButtonText()
            this.updateData();
        });
    }

    saveRemarks(): void {
        const updatedBonuses = {
            remarks: this.bonusesData.remarks
        };

        this.bonusesService.saveNewOrderBonuses(this.bonusesData._id, updatedBonuses).subscribe(() => {
            this.updateData();
            this.dataChange.emit(true);
            this.showSnackBar("Remarks saved");
        });


    }

    updateData(): void {
        const updatedState = {
            ...history.state,
            bonuse: this.bonusesData,
        };

        history.replaceState(updatedState, '');
    }

    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    showSnackBar(message: string): void {
        const durationInSeconds = 5000;
        this.snackBar.open(message, 'Ok', {
            duration: durationInSeconds,
            panelClass: 'main-snackbar',
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    dropToInitialBonuses() {
        this.dropToInitialLoading = true;
        this.bonusesData.ordersBonuses.forEach(order => order.bonus = order.initialBonus);
        this.bonusesData.socialBonuses.forEach(sale => sale.bonus = sale.initialBonus);
        this.dropToInitialLoading = false;
        this.showSnackBar("Bonuses have been reset to their initial value");
    }

    confirmRemark() {
        this.updatingConfirmRemarkIsLoading = true
        this.bonusesService.singleRemarkConfirmAndEmailSend(this.bonusesData._id).subscribe(() => {
            this.updatingConfirmRemarkIsLoading = false;
            this.dataChange.emit(true);
            this.showSnackBar("Remark has been successfully confirmed and an email was sent to a corresponding salesman!");
            this.updateData();
        });
    }

    updateOldHRMBonusById(){
        this.HRMSendLoading = true;
        this.bonusesService.updateOldHRMBonusById(this.bonusesData._id).subscribe(() => {
            this.bonusesData.isSent = true;
            this.HRMSendLoading = false;
            this.showSnackBar("Bonus was sent to HRM!");
        });
    }
}
