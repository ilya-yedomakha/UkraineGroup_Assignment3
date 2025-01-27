import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BonusData} from '../models/BonusData';
import {Bonuses} from '../models/Bonuses';

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

    sendAllBonusesToHRM(): Observable<any> {
        return this.http.post<any>(`${environment.apiEndpoint}/api/salesman/send-bonuses-orangeHRM`, {}, {withCredentials: true})
            .pipe(map(o => o.data));
    }

    reverseConfirmArrayOfIds(changedIds): Observable<string> {
        return this.http.put<{ message: string }>(
            `${environment.apiEndpoint}/api/report/submit/confirmationArrayReverse`,
            {"ids": changedIds},
            {withCredentials: true}
        ).pipe(
            map(response => response.message)
        );
    }

    saveNewOrderBonuses(id: string, bonus: any): Observable<string> {
        return this.http.put<{ message: string }>(
            `${environment.apiEndpoint}/api/report/${id}`,
            bonus,
            {withCredentials: true}
        ).pipe(
            map(response => response.message)
        );
    }

    singleConfirm(id: string): Observable<BonusData> {
        return this.http.put<{ data: BonusData}>(
            `${environment.apiEndpoint}/api/report/reverseConfirm/${id}`,
            {},
            {withCredentials: true}
        ).pipe(
            map(response => BonusData.fromApi(response.data))
        );
    }

    getBonusBySalesmanCodeForCurrentYear(salesmanCode: number): Observable<any> {
        return this.http.get<any>(
            `${environment.apiEndpoint}/api/report/salesman/${salesmanCode}/year/current`,
            {withCredentials: true}
        ).pipe(map(o => o.data));
    }

    getBonusById(id: string): Observable<BonusData> {
        return this.http.get<{ data: BonusData }>(
            `${environment.apiEndpoint}/api/report/${id}`,
            {withCredentials: true}
        ).pipe(map(o => BonusData.fromApi(o.data)));
    }

    getBonusesBySalesmanCode(salesmanCode: number): Observable<Bonuses[]> {
        return this.http.get<{ data: Bonuses[] }>(
            `${environment.apiEndpoint}/api/report/salesman/${salesmanCode}`,
            {withCredentials: true}
        ).pipe(
            map(response =>
                response.data.map(item => Bonuses.fromApi(item))
            )
        );
    }

    getTotalReportsCount(): Observable<number> {
        return this.http.get<{ data: number }>(
            `${environment.apiEndpoint}/api/report/count/total`,
            {withCredentials: true}
        ).pipe(
            map(response =>
                response.data
            )
        );
    }

    getTotalReportsForCurrentYear(): Observable<number> {
        return this.http.get<{ data: number }>(
            `${environment.apiEndpoint}/api/report/count/year/current`,
            {withCredentials: true}
        ).pipe(
            map(response =>
                response.data
            )
        );
    }

    getSignedByCEOReportsCountForCurrentYear(): Observable<number> {
        return this.http.get<{ data: number }>(
            `${environment.apiEndpoint}/api/report/count/signed/CEO/year/current`,
            {withCredentials: true}
        ).pipe(
            map(response =>
                response.data
            )
        );
    }

    getSignedByHRReportsCountForCurrentYear(): Observable<number> {
        return this.http.get<{ data: number }>(
            `${environment.apiEndpoint}/api/report/count/signed/HR/year/current`,
            {withCredentials: true}
        ).pipe(
            map(response =>
                response.data
            )
        );
    }

    confirmBonusById(id: string): Observable<any> {
        return this.http.put<any>(
            `${environment.apiEndpoint}/api/report/salesman-confirm/${id}`,
            {},
            {withCredentials: true}
        ).pipe(response => response);
    }

    rejectBonusById(id: string): Observable<any> {
        return this.http.put<any>(
            `${environment.apiEndpoint}/api/report/salesman-reject/${id}`,
            {},
            {withCredentials: true}
        ).pipe(response => response);
    }

    recalculateSingleBonus(id: string): Observable<BonusData> {
        return this.http.put<{ data: BonusData }>(
            `${environment.apiEndpoint}/api/report/recalculate/${id}`,
            {},
            {withCredentials: true}
        ).pipe(
            map(response => BonusData.fromApi(response.data)
            ));
    }

    getBonusesByYearTop10(): Observable<BonusData[]> {
        return this.http.get<{ data: BonusData[] }>(
            `${environment.apiEndpoint}/api/report/year/current/top10`,
            {withCredentials: true}
        ).pipe(
            map(response =>
                response.data.map(item => BonusData.fromApi(item))
            )
        );
    }

    singleRemarkConfirmAndEmailSend(_id: string): Observable<BonusData> {
        return this.http.post<{ data: BonusData }>(
            `${environment.apiEndpoint}/api/report/confirm/${_id}/remark`,
            {},
            {withCredentials: true}
        ).pipe(
            map(response => BonusData.fromApi(response.data)
            ));
    }
}
