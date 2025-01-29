import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { NgClass, NgIf } from "@angular/common";

@Component({
  selector: 'app-password-change-window',
  templateUrl: './password-change-window.component.html',
  styleUrls: ['./password-change-window.component.css']
})
export class PasswordChangeWindowComponent {
changePasswordForm!: FormGroup;
    @Input() userId: string | null = null;
    @Output() close = new EventEmitter<boolean>();
    updatingSendIsLoading: boolean = false;
  
    private userService = inject(UserService);
    private snackBar = inject(SnackBarService);
  
    constructor(private fb: FormBuilder) { }
  
    ngOnInit(): void {
      this.changePasswordForm = this.fb.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      });
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['userId']) {
        this.initForm();
      }
    }
  
    private initForm(): void {
      this.changePasswordForm.reset();
    }
  
    toClose(): void {
      this.close.emit(false);
    }
  
    onSubmit(): void {
      if (this.changePasswordForm.valid) {
        if (this.changePasswordForm.value.newPassword !== this.changePasswordForm.value.confirmPassword) {
          this.snackBar.showSnackBar('Passwords do not match.');
          return;
        }
  
        this.updatingSendIsLoading = true;
  
        this.userService.changePassword(this.userId, this.changePasswordForm.value.currentPassword, this.changePasswordForm.value.newPassword)
          .subscribe({
            next: () => {
              this.updatingSendIsLoading = false;
              this.close.emit(true);
              this.snackBar.showSnackBar('Password changed successfully.');
            },
            error: (err) => {
              this.updatingSendIsLoading = false;
              this.snackBar.showSnackBar('Error changing password: ' + err.message);
            }
          });
      } else {
        this.snackBar.showSnackBar('Form is invalid');
      }
    }
  }
