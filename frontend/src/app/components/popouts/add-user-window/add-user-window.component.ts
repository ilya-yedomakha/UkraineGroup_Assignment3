import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from 'src/app/models/User';
import {SnackBarService} from 'src/app/services/snack-bar.service';
import {UserService} from 'src/app/services/user.service';
import {NgClass, NgForOf, NgIf} from "@angular/common";


@Component({
    selector: 'app-add-user-window',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgClass,
        NgForOf,
        NgIf
    ],
    templateUrl: './add-user-window.component.html',
    styleUrls: ['./add-user-window.component.css']
})
export class AddUserWindowComponent implements OnChanges{
    creationForm!: FormGroup;
    @Input() user: User = null;
    @Output() close = new EventEmitter<boolean>();
    roles: { label: string, value: number }[] = [
        {label: 'CEO', value: 0},
        {label: 'HR', value: 1},
        {label: 'Salesman', value: 2}
    ];
    private userService = inject(UserService);
    private snackBar = inject(SnackBarService);
    updatingSendIsLoading: boolean = false;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        if (this.user != null) {
            this.creationForm = this.fb.group({
                username: [this.user.username, Validators.required],
                firstname: [this.user.firstname, Validators.required],
                lastname: [this.user.lastname, Validators.required],
                email: [this.user.email, [Validators.required, Validators.email]],
                code: [this.user.code, [Validators.required, Validators.pattern('^[0-9]*$')]],
                role: [this.user.role, Validators.required]
            });
        } else {
            this.creationForm = this.fb.group({
                username: ['', Validators.required],
                firstname: ['', Validators.required],
                lastname: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                code: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
                role: ['', Validators.required]
            });
        }
    }

    toClose(): void {
        this.close.emit(false);
    }

    onSubmit(): void {
        if (this.creationForm.valid) {
            this.updatingSendIsLoading = true;
            const user = new User(
                this.creationForm.value.username,
                this.creationForm.value.code,
                this.creationForm.value.lastname,
                this.creationForm.value.firstname,
                this.creationForm.value.email,
                this.creationForm.value.role
            );
            if (this.user != null){
                this.userService.updateUser(user.code, user).subscribe(() => {
                    this.updatingSendIsLoading = false;
                    this.close.emit(true);
                    this.snackBar.showSnackBar('User updated successfully.');
                    return;
                })
            }
            this.userService.createUser(user).subscribe(() => {
                this.updatingSendIsLoading = false;
                this.close.emit(true);
                this.snackBar.showSnackBar('User created successfully.');
            });
        } else {
            this.snackBar.showSnackBar('Form is invalid');
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['user']) {
            this.initForm();
        }
    }

    private initForm(): void {
        this.creationForm = this.fb.group({
            username: [this.user?.username || '', Validators.required],
            firstname: [this.user?.firstname || '', Validators.required],
            lastname: [this.user?.lastname || '', Validators.required],
            email: [this.user?.email || '', [Validators.required, Validators.email]],
            code: [this.user?.code || '', [Validators.required, Validators.pattern('^[0-9]*$')]],
            role: [this.user?.role ?? '', Validators.required]
        });
    }
}
