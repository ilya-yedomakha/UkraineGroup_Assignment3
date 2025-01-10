import {Component, inject, OnInit} from '@angular/core';
import {BonusData} from 'src/app/models/BonusData';
import {Salesman} from '../../models/Salesman';
import {BonusesService} from '../../services/bonuses.service';

@Component({
    selector: 'app-bonuses-page',
    templateUrl: './bonuses-page.component.html',
    styleUrls: ['./bonuses-page.component.css']
})
export class BonusesPageComponent implements OnInit {

    year: number = new Date().getFullYear();
    bonusesData: BonusData[] = [];
    salesmen: Salesman[] = [];
    private bonusesService = inject(BonusesService);


    public ngOnInit(): void {

        this.bonusesService.getBonuses().subscribe((response) => {
            this.bonusesData = response;
        });
        // get request
        // this.bonusesData = [
        //     new BonusData(1, 'some1', 'last1', [
        //         {productName: 'Product A', clientFullName: 'Client One', clientRating: 'A', items: 5, bonus: 100},
        //         {productName: 'Product B', clientFullName: 'Client Two', clientRating: 'B', items: 3, bonus: 50}
        //     ], [
        //         {goal_description: 'Some name', target_value: 5, actual_value: 4, bonus: 30},
        //         {goal_description: 'Some name1', target_value: 5, actual_value: 3, bonus: 50}
        //     ], 'Great work', 500, true, false, false, false),
        //     new BonusData(2, 'some2', 'last2', [
        //         {productName: 'Product C', clientFullName: 'Client Three', clientRating: 'A', items: 2, bonus: 200}
        //     ], [
        //         {goal_description: 'Some name', target_value: 5, actual_value: 2, bonus: 15},
        //     ], 'Needs improvement', 500, false, false, false, false),
        //     new BonusData(3, 'some3', 'last3', [
        //         {productName: 'Product D', clientFullName: 'Client Four', clientRating: 'C', items: 1, bonus: 25}
        //     ], [
        //         {goal_description: 'Some name4', target_value: 5, actual_value: 3, bonus: 55},
        //         {goal_description: 'Some name3', target_value: 5, actual_value: 1, bonus: 15}
        //     ], 'Consistent performance', 500, true, false, false, false),
        //     new BonusData(4, 'some4', 'last4', [
        //         {productName: 'Product E', clientFullName: 'Client Five', clientRating: 'B', items: 4, bonus: 75}
        //     ], [
        //         {goal_description: 'Some name6', target_value: 5, actual_value: 3, bonus: 55},
        //         {goal_description: 'Some name5', target_value: 5, actual_value: 1, bonus: 15}
        //     ], 'Keep pushing', 500, false, false, false, false)
        // ];

    }

    recalculateBonuses() {

    }

    comfirmAllBonuses() {

    }

    comfirmSelected() {

    }
}
