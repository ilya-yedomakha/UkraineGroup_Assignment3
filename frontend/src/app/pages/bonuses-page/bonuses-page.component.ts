import { Component, OnInit } from '@angular/core';
import { BonusData } from 'src/app/models/BonusData';

@Component({
    selector: 'app-bonuses-page',
    templateUrl: './bonuses-page.component.html',
    styleUrls: ['./bonuses-page.component.css']
})
export class BonusesPageComponent implements OnInit {

    year: number = new Date().getFullYear();
    bonusesData: BonusData[] = [];


    public ngOnInit(): void {

        //get request
        this.bonusesData = [
            new BonusData(1, "some1", "last1", [
                { productName: "Product A", clientFullName: "Client One", clientRating: "A", items: 5, bonus: 100 },
                { productName: "Product B", clientFullName: "Client Two", clientRating: "B", items: 3, bonus: 50 }
            ], [
                { name: "Some name", targetValue: 5, actualValue: 4, bonus: 30 },
                { name: "Some name1", targetValue: 5, actualValue: 3, bonus: 50 }
            ], "Great work", 500, true),
            new BonusData(2, "some2", "last2", [
                { productName: "Product C", clientFullName: "Client Three", clientRating: "A", items: 2, bonus: 200 }
            ], [
                { name: "Some name", targetValue: 5, actualValue: 2, bonus: 15 },
            ], "Needs improvement", 500, false),
            new BonusData(3, "some3", "last3", [
                { productName: "Product D", clientFullName: "Client Four", clientRating: "C", items: 1, bonus: 25 }
            ], [
                { name: "Some name4", targetValue: 5, actualValue: 3, bonus: 55 },
                { name: "Some name3", targetValue: 5, actualValue: 1, bonus: 15 }
            ], "Consistent performance", 500, true),
            new BonusData(4, "some4", "last4", [
                { productName: "Product E", clientFullName: "Client Five", clientRating: "B", items: 4, bonus: 75 }
            ], [
                { name: "Some name6", targetValue: 5, actualValue: 3, bonus: 55 },
                { name: "Some name5", targetValue: 5, actualValue: 1, bonus: 15 }
            ], "Keep pushing", 500, false)
        ];

    }

    recalculateBonuses() {
        
    }

    comfirmAllBonuses(){

    }

    comfirmSelected(){
        
    }
}
