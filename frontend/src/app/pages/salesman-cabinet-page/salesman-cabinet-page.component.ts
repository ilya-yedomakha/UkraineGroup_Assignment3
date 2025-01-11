import { Component,OnInit } from '@angular/core';
import { Bonuses } from 'src/app/models/Bonuses';
import { SalePerformanceRecord } from 'src/app/models/SalePerformanceRecord';
import { Salesman } from 'src/app/models/Salesman';
import { SocialPerformanceRecord } from 'src/app/models/SocialPerformanceRecord';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-salesman-cabinet-page',
  templateUrl: './salesman-cabinet-page.component.html',
  styleUrls: ['./salesman-cabinet-page.component.css']
})
export class SalesmanCabinetPageComponent implements OnInit{

  salesman: Salesman;
  bonuses:Bonuses[];
  socialRecords: SocialPerformanceRecord[];
  saleRecords: SalePerformanceRecord[];
  isAddSocialPerformanceWindowVisible: boolean = false;

  ngOnInit(): void {
  //service!!
  this.salesman = new Salesman(2342,"fsdf","fdsfsd","fsdfs","fds","fsdfs","fsdfs","fdsfsf","fdsfs","fsdfsfs","fdsfs","fdsfs");
  this.bonuses = [new Bonuses(2025,234,234,564)];
  this.socialRecords = [
    new SocialPerformanceRecord("fsdfsdf","Some_1",5,4,2025,3456),
    new SocialPerformanceRecord("fsddfsddf","Some_2",5,4,2025,3456)
  ]

  this.saleRecords = [
    new SalePerformanceRecord("sdffffds",2024,4,234,"fdsfdsfsd", 4,432,"Eggs",32,342,23,"some",23,43,43,"Product"),
    new SalePerformanceRecord("sdffffds",2025,4,234,"fdsfdsfsd", 4,432,"Eggs2",32,32,24,"some",23,43,45,"Product1")
  ]
}

toAddSocialPerformanceRecord(){

}
  }

