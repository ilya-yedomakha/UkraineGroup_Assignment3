import { Component,OnInit } from '@angular/core';
import { Bonuses } from 'src/app/models/Bonuses';
import { Salesman } from 'src/app/models/Salesman';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-salesman-cabinet-page',
  templateUrl: './salesman-cabinet-page.component.html',
  styleUrls: ['./salesman-cabinet-page.component.css']
})
export class SalesmanCabinetPageComponent implements OnInit{

  salesman: Salesman;
  bonuses:Bonuses[];
  isRejectWindowVisible: boolean = false;

  ngOnInit(): void {
  //service!!
  this.salesman = null;
  this.bonuses = [];
}
  }

