import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {User} from '../../models/User';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

    user: User;
    isVisible = true;

    /*
    This array holds the definition of the menu's buttons.
   */
    buttons = [
        {title: 'Dashboard', routerLink: 'welcome-admin-dashboard'},
        {title: 'Bonuses', routerLink: 'bonuses'}, // the tile is the text on the button, the routerLink specifies, where it will navigate
        {title: 'Salesman list', routerLink: 'salesmen'},
        {title: 'System users', routerLink: 'users'},
    ];

    /**
     * The following parameters specify objects, which will be provided by dependency injection
     *
     * @param authService
     * @param router
     * @param userService
     */
    constructor(private authService: AuthService, private router: Router, private userService: UserService) {
    }

    ngOnInit(): void {
        this.fetchUser();
    }

    /**
     * function which handles clicking the logout button
     */
    handleLogout(): void {
        this.authService.logout().subscribe((): void => {
            this.user = null;
            void this.router.navigate(['login']);
            this.reload();
        });
    }

    /**
     * fetches information about logged-in user
     */
    fetchUser(): void {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        },
        (): void => {
            this.user = null;
        });
    }

    reload(): void {
        this.isVisible = false;
        setTimeout((): void => {
            this.isVisible = true;
        }, 0);
    }
}
