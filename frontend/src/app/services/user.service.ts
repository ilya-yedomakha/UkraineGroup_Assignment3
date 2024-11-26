import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/User';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * handles backend communication regarding user accounts
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    /**
     * retrieves userdata of currently authenticated user
     */
    getOwnUser(): Observable<User>{
        // use angular's integrated HTTP-client to make a get request; handle the response as a User object :
        return this.http.get<User>(environment.apiEndpoint + '/api/user', {withCredentials: true});
    }
}
