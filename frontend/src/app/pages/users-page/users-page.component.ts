import {Component, inject, OnInit} from '@angular/core';
import {User} from "../../models/User";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit{
    users: User[] = [];
    isAddUserWindowVisible:boolean = false;
    user: User;


    //private userService = inject(UserService);


    private userService = {
        getUsers: () => {
          return {
            subscribe: (callback: (response: User[]) => void) => {
              const mockUsers: User[] = [
                new User('1', 'johndoe', 101, 'Doe', 'John', 'john.doe@example.com', 2, false),
                new User('2', 'janedoe', 102, 'Doe', 'Jane', 'jane.doe@example.com', 3, true),
                new User('3', 'alexsmith', 103, 'Smith', 'Alex', 'alex.smith@example.com', 1, false),
                new User('4', 'michaeljohnson', 104, 'Johnson', 'Michael', 'michael.johnson@example.com', 2, false)
              ];
              callback(mockUsers); // викликаємо callback з фейковими даними
            }
          };
        }
      };

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
}
