import {Component, inject} from '@angular/core';
import {User} from "../../models/User";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent {
    users: User[] = [];
    private userService = inject(UserService);

    ngOnInit(): void {

        this.userService.getUsers().subscribe((response) => {
            this.users = response;
        });
    }
}
