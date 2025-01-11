import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BonusData} from '../models/BonusData';

@Injectable({
    providedIn: 'root'
})
export class BonusesService {

    constructor(private http: HttpClient) {
    }

    getBonuses(): Observable<BonusData[]> {
        return this.http.get<{ data: BonusData[] }>(
            `${environment.apiEndpoint}/api/report/`,
            {withCredentials: true}
        ).pipe(
            map(response =>
                response.data.map(item => BonusData.fromApi(item))
            )
        );
    }

    getBonusesByYear(year: number): Observable<BonusData[]> {
        return this.http.get<{ data: BonusData[] }>(
            `${environment.apiEndpoint}/api/report/year/${year}`,
            {withCredentials: true}
        ).pipe(
            map(response =>
                response.data.map(item => BonusData.fromApi(item))
            )
        );
    }

    calculateAllBonuses(): Observable<any> {
        return this.http.post(
            `${environment.apiEndpoint}/api/salesman/calculate-bonuses`,
            {},
            {withCredentials: true}
        );
    }

    sendAllConfirmedBonusesToOrangeHRM(changedIds): Observable<string> {
        return this.http.put<{ message: string }>(
            `${environment.apiEndpoint}/api/report/submit/confirmationArrayReverse`,
            {"ids":changedIds},
            { withCredentials: true }
        ).pipe(
            map(response => response.message)
        );
    }

}
