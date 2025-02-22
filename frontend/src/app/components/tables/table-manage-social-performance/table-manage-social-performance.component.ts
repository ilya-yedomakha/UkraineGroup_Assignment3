import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';
import {SocialPerformanceRecord} from 'src/app/models/SocialPerformanceRecord';
import {SocialPerformanceService} from "../../../services/social-performance.service";
import {SnackBarService} from "../../../services/snack-bar.service";

@Component({
    selector: 'app-table-manage-social-performance',
    templateUrl: './table-manage-social-performance.component.html',
    styleUrls: ['./table-manage-social-performance.component.css']
})
export class TableManageSocialPerformanceComponent implements OnInit {

    @Input() socialPerformancesRecords: SocialPerformanceRecord[];
    @Input() userRole: number;
    @Output() updateSocialPerformances = new EventEmitter<boolean>();
    currentPage = 1;
    itemsPerPage = 8;
    totalItems = 0;
    originalTargetValues: { [id: string]: number } = {};
    originalActualValues: { [id: string]: number } = {};
    private socialService = inject(SocialPerformanceService);
    private snackBar = inject(SnackBarService);

    public pagingConfig: PaginationInstance = {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        totalItems: this.totalItems
    };

    ngOnInit(): void {
        this.totalItems = this.socialPerformancesRecords.length;
        this.socialPerformancesRecords.forEach((record): void => {
            this.originalActualValues[record._id] = record.actual_value;
            this.originalTargetValues[record._id] = record.target_value;
        });
    }

    onTableDataChange(event: any): void {
        this.pagingConfig.currentPage = event;
    }

    onTableSizeChange(event: any): void {
        this.pagingConfig.itemsPerPage = event.target.value;
        this.pagingConfig.currentPage = 1;
    }

    onActualValueChange(record: SocialPerformanceRecord, newValue: number) {
        record.actual_value = Number(newValue);
    }

    isSaveDisabled(record: SocialPerformanceRecord): boolean {
        return record.actual_value === this.originalActualValues[record._id]
            && record.target_value === this.originalTargetValues[record._id];
    }

    toDeleteSocialPerformanceRecord(_id: string): void {
        this.socialService.deleteSocialPerformanceRecord(_id).subscribe({
            next: (): void => {
                this.updateSocialPerformances.emit(true);
                this.snackBar.showSnackBar('Social performance records was deleted');
            },
            error: (err) => {
                const errorMessage = err.error?.message;
                this.snackBar.showSnackBar('Error: ' + errorMessage);
            }
        });
    }

    toUpdateSocialPerformanceRecord(socialPerformancesRecord: SocialPerformanceRecord): void {
        this.originalActualValues[socialPerformancesRecord._id] = socialPerformancesRecord.actual_value;
        this.originalTargetValues[socialPerformancesRecord._id] = socialPerformancesRecord.target_value;
        this.socialService.updateSocialPerformanceRecord(socialPerformancesRecord._id, socialPerformancesRecord).subscribe({
            next: (): void => {
                this.snackBar.showSnackBar('Social performance records updated');
            },
            error: (err): void => {
                const errorMessage = err.error?.message;
                this.snackBar.showSnackBar('Error: ' + errorMessage);
            }
        });

    }

    onTargetValueChange(record: SocialPerformanceRecord, newValue: number) {
        record.target_value = Number(newValue);
    }
}
