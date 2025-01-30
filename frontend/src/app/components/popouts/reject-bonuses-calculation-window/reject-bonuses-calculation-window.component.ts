import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {RejectionService} from '../../../services/rejection.service';
import {BonusesService} from '../../../services/bonuses.service';
import {SnackBarService} from "../../../services/snack-bar.service";

@Component({
    selector: 'app-reject-bonuses-calculation-window',
    templateUrl: './reject-bonuses-calculation-window.component.html',
    styleUrls: ['./reject-bonuses-calculation-window.component.css']
})
export class RejectBonusesCalculationWindowComponent implements OnInit {


    @Output() close = new EventEmitter<boolean>();
    @Input() salesmanCode: number;
    errorMessage: string = null;
    private rejectionService = inject(RejectionService);
    private bonusesService = inject(BonusesService);
    private snackBar = inject(SnackBarService);
    private reportId: string;

    ngOnInit(): void {
        this.bonusesService.getBonusBySalesmanCodeForCurrentYear(this.salesmanCode)
            .subscribe(value => {
                this.reportId = value[0]._id;
            });
    }

    toClose(): void {
        this.close.emit(false);
    }

    send(message: string): void {
        this.bonusesService.rejectBonusById(this.reportId).subscribe(() => {
        }, error => {
            this.snackBar.showSnackBar('Error: ' + error.error?.message);
        });
        this.rejectionService.saveRejection(this.reportId, message).subscribe({
            next: () => {
                this.errorMessage = null;
                this.snackBar.showSnackBar('Your response was sent');
                this.close.emit(true);
            },
            error: () => {
                this.errorMessage = 'No reason for rejection is written';
            }
        });
    }
}
