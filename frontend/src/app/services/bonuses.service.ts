import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BonusData} from "../models/BonusData";

@Injectable({
    providedIn: 'root'
})
export class BonusesService {

    constructor(private http: HttpClient) { }
    getBonuses(): Observable<BonusData[]> {
        return this.http.get<{ data: BonusData[] }>(
            `${environment.apiEndpoint}/api/report/`,
            { withCredentials: true }
        ).pipe(
            map(response =>
                response.data.map(item => BonusData.fromApi(item)) // Transform each item to BonusData
            )
        );
    }
}
