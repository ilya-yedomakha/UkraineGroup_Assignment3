import {Component, Input, OnInit} from '@angular/core';
import {NgChartsModule} from 'ng2-charts';
import {ChartConfiguration, ChartOptions, ChartType} from "chart.js";
import {Bonuses} from 'src/app/models/Bonuses';

@Component({
    selector: 'app-bar-graph-salesman-bonuses',
    templateUrl: './bar-graph-salesman-bonuses.component.html',
    styleUrls: ['./bar-graph-salesman-bonuses.component.css']
})
export class BarGraphSalesmanBonusesComponent implements OnInit {

    public chart: any;

    @Input() bonuses: Bonuses[] = [];

    public barChartData: ChartConfiguration<'bar'>['data'];

    ngOnInit(): void {
        const copyBonuses = [...this.bonuses];
        copyBonuses.sort((a, b) => a.year - b.year);
        this.barChartData = {

            labels: copyBonuses.map(bonus => bonus.year),


            datasets: [
                {

                    data: copyBonuses.map(bonus => bonus.totalBonuses),

                    label: 'Bonuses( ' + copyBonuses[0].year + " - " + copyBonuses[copyBonuses.length - 1].year + ')',

                    borderColor: 'black',

                    backgroundColor: 'rgba(208, 172, 20, 0.73)'

                }

            ]

        }
    }

    public barChartOptions: ChartOptions<'bar'> = {

        responsive: false

    };

    public barChartLegend = true;


}
