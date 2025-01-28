import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-add-user-window',
  standalone: true,
  imports: [],
  templateUrl: './add-user-window.component.html',
  styleUrls: ['./add-user-window.component.css']
})
export class AddUserWindowComponent {
  creationForm!: FormGroup;
@Output() close = new EventEmitter<boolean>();
roles: { label: string, value: number }[] = [
  { label: 'CEO', value: 0 },
  { label: 'HR', value: 1 },
  { label: 'Salesman', value: 2 }
];
private userService = inject(UserService);
private snackBar = inject(SnackBarService);

constructor(private fb: FormBuilder) {}

ngOnInit(): void {
  this.creationForm = this.fb.group({
    username: ['', Validators.required],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    role: ['', Validators.required],
    isAdmin: [false]
  });
}

toClose(): void {
  this.close.emit(true);
}

onSubmit(): void {
  if (this.creationForm.valid) {
    const user = new User(
      '',
      this.creationForm.value.username,
      this.creationForm.value.code,
      this.creationForm.value.lastname,
      this.creationForm.value.firstname,
      this.creationForm.value.email,
      this.creationForm.value.role,
      this.creationForm.value.isAdmin
    );
 //   this.userService.createUser(user).subscribe(() => {
  //    this.close.emit(true);
  //   this.snackBar.showSnackBar('User created successfully.');
  //  });
  } else {
    this.snackBar.showSnackBar('Form is invalid');
  }
}
}