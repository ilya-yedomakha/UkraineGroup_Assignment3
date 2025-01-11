import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SalesmanService} from '../../../services/salesman.service';
import {SocialPerformanceRecord} from '../../../models/SocialPerformanceRecord';

@Component({
    selector: 'app-add-social-performance-window',
    templateUrl: './add-social-performance-window.component.html',
    styleUrls: ['./add-social-performance-window.component.css']
})
export class AddSocialPerformanceWindowComponent implements OnInit {

    creationForm!: FormGroup;
    @Input() salesmenCode: number;
    @Output() close = new EventEmitter<boolean>();
    description: string[] = ['Leadership Competence',
        'Openness to Employee',
        'Social Behavior to Employee',
        'Attitude toward Client',
        'Communication Skills',
        'Integrity to Company'];
    valueOptions: number[] = [1, 2, 3, 4, 5];
    private salesmenService = inject(SalesmanService);

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.creationForm = this.fb.group({
            description: ['', Validators.required],
            targetValue: [1, Validators.required],
            actualValue: [1, Validators.required],
        });
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
            });
        } else {
            console.log('Form is invalid');
        }
    }
}
