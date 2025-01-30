import {Component, inject, OnInit} from '@angular/core';
import {Salesman} from 'src/app/models/Salesman';
import {SalesmanService} from 'src/app/services/salesman.service';
import {SnackBarService} from "../../services/snack-bar.service";

@Component({
    selector: 'app-salesmen-page',
    templateUrl: './salesmen-page.component.html',
    styleUrls: ['./salesmen-page.component.css']
})
export class SalesmenPageComponent implements OnInit {

    salesmen: Salesman[] = [];
    private salesmanService = inject(SalesmanService);
    private snackBarService = inject(SnackBarService);

    ngOnInit(): void {

        this.salesmanService.getSalesmen().subscribe({
            next: (response) => this.salesmen = response,
            error: (err): void => this.snackBarService.showSnackBar('Error: ' + err.error?.message),
        });
    }

}
