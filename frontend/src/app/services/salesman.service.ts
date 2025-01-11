import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SalesmanService {

    constructor(private http: HttpClient) { }

    getSalesmen(): Observable<any>{
        return this.http.get<any>(environment.apiEndpoint + '/api/salesman/', {withCredentials: true}).pipe(map(o => o.data));
    }

    getSalesmanByCode(code: number): Observable<any>{
        return this.http.get<any>(`${environment.apiEndpoint}/api/salesman/${code}`, { withCredentials: true})
            .pipe(map(o => o.data));
    }

    importSeniorSalesmenFromOrangeHRM(): Observable<any>{
        return this.http.get<any>(`${environment.apiEndpoint}/api/salesman/import-from-orangeHRM`, {withCredentials: true})
            .pipe(map(o => o.data));
    }

    calculateAllBonuses(): Observable<any>{
        return this.http.post<any>(`${environment.apiEndpoint}/api/salesman/calculate-bonuses`, {withCredentials: true})
            .pipe(map(o => o.data));
    }

    sendAllBonusesToHRM(): Observable<any>{
        return this.http.post<any>(`${environment.apiEndpoint}/api/salesman/send-bonuses-orangeHRM`, {withCredentials: true})
            .pipe(map(o => o.data));
    }

    createSocialPerformanceToSalesmanBySalesmanCode(code: number): Observable<any>{
        return this.http.post<any>(`${environment.apiEndpoint}/api/salesman/${code}/social_performance_record`, {withCredentials: true})
            .pipe(map(o => o.data));
    }
}