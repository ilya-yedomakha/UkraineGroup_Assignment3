import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExampleDatapoint} from '../interfaces/example-datapoint';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PeopleDemoService {

    constructor(private http: HttpClient) { }

    getPeople(): Observable<HttpResponse<ExampleDatapoint[]>>{
        return this.http.get<ExampleDatapoint[]>(environment.apiEndpoint + '/api/people', {observe: 'response', withCredentials: true});
    }
}
