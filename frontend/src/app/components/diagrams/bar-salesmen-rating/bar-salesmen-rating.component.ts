import { Component, Input, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { Bonuses } from 'src/app/models/Bonuses';

@Component({
    selector: 'app-bar-salesmen-rating',
    templateUrl: './bar-salesmen-rating.component.html',
    styleUrls: ['./bar-salesmen-rating.component.css']
})
export class BarSalesmenRatingComponent {
    public chart: any;

    @Input() bonuses: any = [];
    @Input() salesmenFullname: any = [];
    public barChartData: ChartConfiguration<'bar'>['data'];

    ngOnInit(): void {

        const bonusesWithSalesmen = this.bonuses.map((bonus, index) => ({
            bonus,
            salesman: this.salesmenFullname[index],
        }));

        const sortedBonuses = bonusesWithSalesmen.sort(
            (a, b) => a.bonus - b.bonus
        );

        let top10 = []

        if(sortedBonuses.length < 10){
            top10 = sortedBonuses;
        } else{
            top10 = sortedBonuses.slice(0, 10);
        }


        const top10Bonuses = top10.map(item => item.bonus);
        const top10Salesmen = top10.map(item => item.salesman);

        this.barChartData = {

            labels: top10.map(item => item.salesman),



            datasets: [
                {

                    data: top10.map(item => item.bonus),

                    label: 'Top 10 salesmen for current year by total amount of bonuses',

                    borderColor: 'black',

                    backgroundColor: ["#eb4034", "#ebd621", "#68eb21", "#0ce881", "#0cc3e8","#0c4ae8","#940ce8","#e80cc0","#47e80c","#310ce8"],

                }

            ]

        }
    }

    public barChartOptions: ChartOptions<'bar'> = {

        responsive: false

    };

    public barChartLegend = true;
}
