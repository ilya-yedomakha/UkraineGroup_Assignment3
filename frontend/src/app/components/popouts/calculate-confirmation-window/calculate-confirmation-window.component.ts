import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {BonusesService} from '../../../services/bonuses.service';
import {SnackBarService} from "../../../services/snack-bar.service";

@Component({
    selector: 'app-calculate-confirmation-window',
    templateUrl: './calculate-confirmation-window.component.html',
    styleUrls: ['./calculate-confirmation-window.component.css']
})
export class CalculateConfirmationWindowComponent implements OnInit {

    @Output() close = new EventEmitter<boolean>();
    @Output() confirmationSuccess = new EventEmitter<boolean>();
    private bonusesService = inject(BonusesService);
    private snackBar = inject(SnackBarService);

    ngOnInit(): void {

    }

    toClose(): void {
        this.close.emit(false);
    }

    onConfirm(): void {
        this.bonusesService.calculateAllBonuses().subscribe({
            next: () => {
                this.confirmationSuccess.emit(true);
                this.close.emit(true);
                this.snackBar.showSnackBar('Selected bonuses was saved successfully');
            },
            error: (err) => {
                const errorMessage = err.error?.message;
                this.snackBar.showSnackBar('Error: ' + errorMessage);
            }
        });
    }
}
