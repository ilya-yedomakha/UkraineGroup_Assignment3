import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SalesmanService} from '../../../services/salesman.service';
import {SocialPerformanceRecord} from '../../../models/SocialPerformanceRecord';
import {SnackBarService} from "../../../services/snack-bar.service";

@Component({
    selector: 'app-add-social-performance-window',
    templateUrl: './add-social-performance-window.component.html',
    styleUrls: ['./add-social-performance-window.component.css']
})
export class AddSocialPerformanceWindowComponent implements OnInit {

    creationForm!: FormGroup;
    @Input() salesmenCode: number;
    @Input() socialPerformances: SocialPerformanceRecord[];
    @Output() close = new EventEmitter<boolean>();
    description: string[] = ['Leadership Competence',
        'Openness to Employee',
        'Social Behavior to Employee',
        'Attitude toward Client',
        'Communication Skills',
        'Integrity to Company'];
    valueOptions: number[] = [1, 2, 3, 4, 5];
    private salesmenService = inject(SalesmanService);
    private snackBar = inject(SnackBarService);

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.creationForm = this.fb.group({
            description: ['', Validators.required],
            targetValue: [1, Validators.required],
            actualValue: [1, Validators.required],
        });
        const socialPerformancesForCurrentYear = this.socialPerformances.filter(value => value.year === new Date().getFullYear());
        const socialPerformanceDescriptions = socialPerformancesForCurrentYear.map(value => value.goal_description);
        this.description = this.description.filter(description => !socialPerformanceDescriptions.includes(description));
    }

    toClose(): void {
        this.close.emit(true);
    }

    onSubmit(): void {
        if (this.creationForm.valid) {
            console.log('Form submitted:', this.creationForm.value);
            const socialPerformanceRecord = new SocialPerformanceRecord(
                this.creationForm.value.description,
                this.creationForm.value.targetValue,
                this.creationForm.value.actualValue,
                new Date().getFullYear(),
                this.salesmenCode
            );
            // logic
            this.salesmenService.createSocialPerformanceToSalesmanBySalesmanCode(
                this.salesmenCode, socialPerformanceRecord
            ).subscribe(() => {
                this.close.emit(true);
                this.snackBar.showSnackBar('Social performance record saved successfully.');
            });
        } else {
            this.snackBar.showSnackBar('Form is invalid');
        }
    }
}
