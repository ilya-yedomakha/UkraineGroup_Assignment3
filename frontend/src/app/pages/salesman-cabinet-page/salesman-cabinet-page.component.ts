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
  this.salesman = new Salesman(2342,"fsdf","fdsfsd","fsdfs","fds","fsdfs","fsdfs","fdsfsf","fdsfs","fsdfsfs","fdsfs","fdsfs");
  this.bonuses = [new Bonuses(2025,234,234,564)];
}
  }

