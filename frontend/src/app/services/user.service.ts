import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/User';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from "rxjs/operators";

/**
 * handles backend communication regarding user accounts
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {
    }

    /**
     * retrieves userdata of currently authenticated user
     */
    getOwnUser(): Observable<User> {
        // use angular's integrated HTTP-client to make a get request; handle the response as a User object :
        return this.http.get<User>(environment.apiEndpoint + '/api/user', {withCredentials: true});
    }

    getUsers() {
        return this.http.get<any>(environment.apiEndpoint + '/api/users', {withCredentials: true}).pipe(map(o => o.data));
    }

    getUsersCount() {
        return this.http.get<any>(environment.apiEndpoint + '/api/users/total/count/', {withCredentials: true}).pipe(map(o => o.data));
    }

    createUser(user: User) {
        return this.http.post<User>(environment.apiEndpoint + '/api/users',
            user,
            {withCredentials: true});
    }

    deletingUser(code: number) {
        return this.http.delete<any>(environment.apiEndpoint + `/api/users/${code}`,
            {withCredentials: true}).pipe(map(o => o.message));
    }

    updateUser(code: number, userUPD: User){
        return this.http.put<any>(environment.apiEndpoint + `/api/users/${code}`,
            userUPD,
            {withCredentials: true}).pipe(map(o => o.message));
    }

    changePassword(oldPassword: string, newPassword: string){
        return this.http.put<any>(environment.apiEndpoint + `/api/users/password/change/`,
            {
                oldPassword: oldPassword,
                newPassword: newPassword
            },
            {withCredentials: true}).pipe(map(o => o.message));
    }
}
