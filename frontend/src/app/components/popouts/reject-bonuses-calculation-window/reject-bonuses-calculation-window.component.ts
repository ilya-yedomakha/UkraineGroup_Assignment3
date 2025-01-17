import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {RejectionService} from '../../../services/rejection.service';
import {BonusesService} from '../../../services/bonuses.service';

@Component({
    selector: 'app-reject-bonuses-calculation-window',
    templateUrl: './reject-bonuses-calculation-window.component.html',
    styleUrls: ['./reject-bonuses-calculation-window.component.css']
})
export class RejectBonusesCalculationWindowComponent implements OnInit {


    @Output() close = new EventEmitter<boolean>();
    @Input() salesmanCode: number;
    private rejectionService = inject(RejectionService);
    private bonusesService = inject(BonusesService);
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
        this.bonusesService.rejectBonusById(this.reportId).subscribe();
        this.rejectionService.saveRejection(this.reportId, message).subscribe(value => {
            this.close.emit(true);
        },
        error => {
            this.close.emit(false);
            console.log(error);
        });
    }
}
