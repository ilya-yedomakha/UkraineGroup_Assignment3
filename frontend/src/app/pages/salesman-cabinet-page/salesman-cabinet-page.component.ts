import { Component,OnInit } from '@angular/core';
import { Bonuses } from 'src/app/models/Bonuses';
import { PersonalDetails } from 'src/app/models/PersonalDetails';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-salesman-cabinet-page',
  templateUrl: './salesman-cabinet-page.component.html',
  styleUrls: ['./salesman-cabinet-page.component.css']
})
export class SalesmanCabinetPageComponent implements OnInit{

  user: User;
  bonuses:Bonuses[];
  isRejectWindowVisible: boolean = false;

  ngOnInit(): void {
    this.user = new User(
      '12345',
      'johndovgal',
      new PersonalDetails(
          1,
          'John',
          'Some',
          'Dovgal',
          'Male',
          '2003-09-16',
          '123 Main St, City',
          '+38097198621',
          'Seniour Salesman',
          '2020-01-15',
          50000,
          'john.doevgal@company.com',
          'Employee name',
          'Ukrainian'
      ),
      false
  );

  this.bonuses = [new Bonuses(2025, 400,500,900),new Bonuses(2023, 344,234,700),new Bonuses(2022, 322,333,435),new Bonuses(2021, 150,100,250),
    new Bonuses(2021, 322,333,435),new Bonuses(2020, 150,100,250),
    new Bonuses(2019, 322,333,435),new Bonuses(2018, 150,100,250),
    new Bonuses(2017, 322,333,435),new Bonuses(2016, 150,100,250)];
}
  }

