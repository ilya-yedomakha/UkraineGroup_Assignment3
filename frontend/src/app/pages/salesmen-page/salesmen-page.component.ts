import {Component, inject, OnInit} from '@angular/core';
import {Salesman} from 'src/app/models/Salesman';
import {SalesmanService} from 'src/app/services/salesman.service';

@Component({
    selector: 'app-salesmen-page',
    templateUrl: './salesmen-page.component.html',
    styleUrls: ['./salesmen-page.component.css']
})
export class SalesmenPageComponent implements OnInit {

    salesmen: Salesman[] = [];
    private salesmanService = inject(SalesmanService);

    ngOnInit(): void {

        this.salesmanService.getSalesmen().subscribe((response) => {
            this.salesmen = response;
        });
    }

}
