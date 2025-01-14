import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RejectionService {

    private baseUrl = `${environment.apiEndpoint}/api/rejection`;

    constructor(private http: HttpClient) {
    }

    saveRejection(reportId: string, message: string): Observable<any> {
        return this.http.post<any>(
            `${this.baseUrl}/report/${reportId}`,
            {message},
            {withCredentials: true})
            .pipe(map(res => res.data));
    }

    getRejectionById(id: string): Observable<any> {
        return this.http.get<any>(
            `${this.baseUrl}/${id}`,
            {withCredentials: true}
        ).pipe(map(res => res.data));
    }

    getRejectionsForSalesman(salesmanCode: number): Observable<any> {
        return this.http.get<any>(
            `${this.baseUrl}/salesman/${salesmanCode}`,
            {withCredentials: true}
        ).pipe(map(res => res.data));
    }

    deleteRejectionById(id: string): Observable<any> {
        return this.http.delete<any>(
            `${this.baseUrl}/${id}`,
            {withCredentials: true}
        ).pipe(map(res => res.data));
    }

    deleteRejectionsByReport(reportId: string): Observable<any> {
        return this.http.delete<any>(
            `${this.baseUrl}/report/${reportId}`,
            {withCredentials: true}
        ).pipe(map(res => res.data));
    }

    deleteRejectionsBySalesmanCode(salesmanCode: number): Observable<any> {
        return this.http.delete<any>(
            `${this.baseUrl}/salesman/${salesmanCode}`,
            {withCredentials: true}
        ).pipe(map(res => res.data));
    }
}