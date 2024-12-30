import { Component, OnInit } from '@angular/core';
import { BonusData } from 'src/app/models/BonusData';

@Component({
  selector: 'app-change-bonuses-page',
  templateUrl: './change-bonuses-page.component.html',
  styleUrls: ['./change-bonuses-page.component.css']
})
export class ChangeBonusesPageComponent implements OnInit {

  bonusesData: BonusData;

  public ngOnInit(): void {
    this.bonusesData = history.state.bonuse;
  }

  getTotalBonuses(bonuses: BonusData): number {
    const ordersBonusesSum = bonuses.ordersBonuses.reduce((sum, ob) => Number(sum) + Number(ob.bonus), 0);
    const socialBonusesSum = bonuses.socialBonuses.reduce((sum, ob) => Number(sum) + Number(ob.bonus), 0);
    return ordersBonusesSum + socialBonusesSum;
  }
}
