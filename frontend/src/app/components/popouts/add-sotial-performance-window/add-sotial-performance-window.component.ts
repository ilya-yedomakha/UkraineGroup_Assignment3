import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-sotial-performance-window',
  templateUrl: './add-sotial-performance-window.component.html',
  styleUrls: ['./add-sotial-performance-window.component.css']
})
export class AddSotialPerformanceWindowComponent {
  
  rejectionForm!: FormGroup;
  @Output() close  = new EventEmitter<boolean>();
  reasons: string[] = ['Reason 1', 'Reason 2', 'Reason 3', 'Reason 4'];
  valueOptions: number[] = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.rejectionForm = this.fb.group({
      reason: ['', Validators.required],
      targetValue: [1, Validators.required],
      actualValue: [1, Validators.required],
    });
  }

  toClose(): void {
    this.close.emit(true);
  }

  onSubmit(): void {
    if (this.rejectionForm.valid) {
      console.log('Form submitted:', this.rejectionForm.value);
      //logic
    } else {
      console.log('Form is invalid');
    }
  }
}
