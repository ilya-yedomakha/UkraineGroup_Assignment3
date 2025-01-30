import {Component, inject, OnInit} from '@angular/core';
import {User} from "../../models/User";
import {UserService} from "../../services/user.service";
import {SnackBarService} from "../../services/snack-bar.service";

@Component({
    selector: 'app-users-page',
    templateUrl: './users-page.component.html',
    styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {
    users: User[] = [];
    isAddUserWindowVisible: boolean = false;
    user: User;
    userToUpdate: User = null;


    private userService = inject(UserService);
    private snackBarService = inject(SnackBarService);

    ngOnInit(): void {

        this.userService.getUsers().subscribe((response) => {
            this.users = response;
        });

        this.fetchUser();
    }


    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }

    handleUserChanging($event: boolean) {
        this.isAddUserWindowVisible = false
        this.userToUpdate = null;
        if ($event) {
            this.userService.getUsers().subscribe({
                next: (response) => this.users = response,
                error: (err): void => this.snackBarService.showSnackBar('Error: ' + err.error?.message),
            });
        }
    }

    updateUser($event: number) {
        this.userToUpdate = this.users.find((user: User) => user.code === $event);
        if (this.userToUpdate) {
            this.isAddUserWindowVisible = true;
        }
    }
}
