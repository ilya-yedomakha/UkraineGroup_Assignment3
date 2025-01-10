import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SocialPerformanceService {

    constructor(private http: HttpClient) { }

    getAllSocialPerformanceRecords(): Observable<any>{
        return this.http.get<any>(environment.apiEndpoint + '/api/social_performance_record/', {withCredentials: true})
            .pipe(map(o => o.data));
    }

    getSocialPerformanceRecordById(id: number): Observable<any>{
        return this.http.get<any>(`${environment.apiEndpoint}/api/social_performance_record/${id}`, {withCredentials: true})
            .pipe(map(o => o.data));
    }

    getSocialPerformancesRecordBySalesmanCode(salesmanCode: number): Observable<any>{
        return this.http.get<any>(`${environment.apiEndpoint}/api/social_performance_record/salesman/${salesmanCode}`,
            {withCredentials: true})
            .pipe(map(o => o.data));
    }

    updateSocialPerformanceRecord(id: number): Observable<any>{
        return this.http.put<any>(`${environment.apiEndpoint}/api/social_performance_record/${id}`, {withCredentials: true})
            .pipe(map(o => o.data));
    }

    deleteSocialPerformanceRecord(id: number): Observable<any>{
        return this.http.delete<any>(`${environment.apiEndpoint}/api/social_performance_record/${id}`, {withCredentials: true});
    }

    deleteSocialPerformanceRecordBySalesmanCode(salesmanCode: number): Observable<any>{
        return this.http.delete<any>(`${environment.apiEndpoint}/api/social_performance_record//salesman/${salesmanCode}`,
            {withCredentials: true});
    }
}
