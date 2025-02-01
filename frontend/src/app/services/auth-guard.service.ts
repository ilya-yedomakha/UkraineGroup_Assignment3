import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

/**
 * this service implements the CanActivate interface
 * it enables angular router, to check whether a user is allowed to access a page or not
 */
@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // mapping isLoggedIn():Observable to this function:
        return this.authService.isLoggedIn()
            .pipe(
                map((loggedIn): boolean => {
                    const userRole = this.authService.getUserRole();
                    const allowedRoles = route.data['roles'] as number[];

                    if (!loggedIn) { // go back to login, if user is not allowed to enter
                        void this.router.navigate(['login']);
                    } else if (!allowedRoles.includes(userRole!)){
                        void this.router.navigate(['forbidden']);
                    }
                    return loggedIn;
                })
            );
    }
}
