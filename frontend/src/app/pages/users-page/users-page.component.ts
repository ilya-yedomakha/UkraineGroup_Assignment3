import {Component, inject, OnInit} from '@angular/core';
import {User} from "../../models/User";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-users-page',
    templateUrl: './users-page.component.html',
    styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {
    users: User[] = [];
    isAddUserWindowVisible: boolean = false;
    user: User;


    private userService = inject(UserService);

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
        if ($event) {
            this.userService.getUsers().subscribe((response) => {
                this.users = response;
            });
        }
    }
}
