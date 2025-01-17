import { Component,Input } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";

@Component({
  selector: 'app-pie-count-confirmation-statistics',
  templateUrl: './pie-count-confirmation-statistics.component.html',
  styleUrls: ['./pie-count-confirmation-statistics.component.css']
})
export class PieCountConfirmationStatisticsComponent {
    public chart: any;

    @Input() signatures!: any;
    @Input() chartLabels!:any;
    @Input() chartLabel!: any;
    hoverOffset: 4
    pieChartConfig: any;
    chartLegends!: boolean;




    ngOnInit(): void {
        console.log(this.signatures)
        this.pieChartConfig = {

            chartData: [
                {
                    data: this.signatures,
                    label: this.chartLabel,
                    backgroundColor: ["#28c217", "#e32c0b"],
                    hoverBackgroundColor: ["#14700a", "#611508"]
                },

            ],
            chartLabels: this.chartLabels,
            legends: true,
            options: {
                responsive: true,
            }
        };
    }
}
