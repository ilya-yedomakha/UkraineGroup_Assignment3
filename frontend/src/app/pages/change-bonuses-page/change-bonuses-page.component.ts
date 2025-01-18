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
    @Output() dataChange = new EventEmitter<boolean>();
    private userService: UserService = inject(UserService);
    private bonusesService = inject(BonusesService);
    snackBar = inject(MatSnackBar);
    dropToInitialLoading: boolean = false;


    public ngOnInit(): void {
        this.user = new User("some","user",2345,"sdf", "fds", "dfsfsfs", 0, true);
         this.bonusesData = 
             new BonusData("1", 'some1', 'last1', [
                 {productName: 'Product A', clientFullName: 'Client One', clientRating: 'A', items: 5, initialBonus: 50, bonus: 100},
                 {productName: 'Product B', clientFullName: 'Client Two', clientRating: 'B', items: 3, initialBonus: 100, bonus: 50}
             ], [
                 {goal_description: 'Some name', target_value: 5, actual_value: 4, initialBonus: 90, bonus: 30},
                 {goal_description: 'Some name1', target_value: 5, actual_value: 3, initialBonus: 80, bonus: 50}
             ], 'Great work', 500, true, false, false, false)
    }

    getTotalBonuses(bonuses: BonusData): number {
        const ordersBonusesSum = bonuses.ordersBonuses.reduce((sum, ob) => Number(sum) + Number(ob.bonus), 0);
        const socialBonusesSum = bonuses.socialBonuses.reduce((sum, ob) => Number(sum) + Number(ob.bonus), 0);
        return ordersBonusesSum + socialBonusesSum;
    }

    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }

    saveSocialAndOrderBonuses(): void {
        const updatedBonuses = {
            socialBonuses: this.bonusesData.socialBonuses,
            ordersBonuses: this.bonusesData.ordersBonuses,
        };

        this.bonusesService.saveNewOrderBonuses(this.bonusesData._id, updatedBonuses).subscribe(() => {
            this.updateData();
            this.dataChange.emit(true);
        });
    }

    singleConfirm(): void {
        this.bonusesService.singleConfirm(this.bonusesData._id).subscribe(() => {
            this.updateData();
            this.dataChange.emit(true);
        });
    }

    saveRemarks(): void {
        const updatedBonuses = {
            remarks: this.bonusesData.remarks
        };

        this.bonusesService.saveNewOrderBonuses(this.bonusesData._id, updatedBonuses).subscribe(() => {
            this.updateData();
            this.dataChange.emit(true);
        });

        this.showSnackBar();
    }

    updateData(): void {
        const updatedState = {
            ...history.state,
            bonuse: this.bonusesData,
        };

        history.replaceState(updatedState, '');
    }

    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    showSnackBar(): void {
        const durationInSeconds = 5;
        this.snackBar.openFromComponent(CustomSnackBarComponent, {
            duration: durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition
        });
    }

    dropToInitialBonuses(){
        this.dropToInitialLoading = true;
        this.bonusesData.ordersBonuses.forEach(order=> order.bonus = order.initialBonus);
        this.bonusesData.socialBonuses.forEach(sale=> sale.bonus = sale.initialBonus);
        this.dropToInitialLoading = false;
    }
}
