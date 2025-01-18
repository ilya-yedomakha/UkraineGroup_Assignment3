import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from "rxjs";
import {SalePerformanceRecord} from "../models/SalePerformanceRecord";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class SalesService {

    private baseUrl = `${environment.apiEndpoint}/api/sale_performance_record`;

    constructor(private http: HttpClient) {}

    getSalePerformRecordsBySalesmanCode(code: number): Observable<SalePerformanceRecord[]> {
        return this.http.get<{ data: SalePerformanceRecord[] }>(
            `${this.baseUrl}/salesman/${code}`,
            {withCredentials: true}
        ).pipe(
            map((res): SalePerformanceRecord[] =>
                res.data.map((sale): SalePerformanceRecord => SalePerformanceRecord.fromApi(sale))
            )
        );
    }
}
