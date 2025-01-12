import { Component, inject, OnInit } from '@angular/core';
import { BonusData } from 'src/app/models/BonusData';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-bonuses-page',
  templateUrl: './change-bonuses-page.component.html',
  styleUrls: ['./change-bonuses-page.component.css']
})
export class ChangeBonusesPageComponent implements OnInit {

  bonusesData: BonusData;
  user: User;
  private userService: UserService = inject(UserService);

  public ngOnInit(): void {
    this.fetchUser();
    this.bonusesData = history.state.bonuse;
  }

  getTotalBonuses(bonuses: BonusData): number {
    const ordersBonusesSum = bonuses.ordersBonuses.reduce((sum, ob) => Number(sum) + Number(ob.bonus), 0);
    const socialBonusesSum = bonuses.socialBonuses.reduce((sum, ob) => Number(sum) + Number(ob.bonus), 0);
    return ordersBonusesSum + socialBonusesSum;
  }

  fetchUser(): void{
    this.userService.getOwnUser().subscribe((user): void => {
        this.user = user;
    });
}
}
