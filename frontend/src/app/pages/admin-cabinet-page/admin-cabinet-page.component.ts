import { Component, inject } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-cabinet-page',
  templateUrl: './admin-cabinet-page.component.html',
  styleUrls: ['./admin-cabinet-page.component.css']
})
export class AdminCabinetPageComponent {

  isPasswordChangeWindowIsVisible: boolean = false;
  user:User;
  private userService = inject(UserService);


  public ngOnInit(): void {
    this.fetchUser();
}


fetchUser(): void {
  this.userService.getOwnUser().subscribe((user): void => {
      this.user = user;
  });
}
}
