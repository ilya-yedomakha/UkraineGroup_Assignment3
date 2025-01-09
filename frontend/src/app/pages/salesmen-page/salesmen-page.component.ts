import { Component, OnInit } from '@angular/core';
import { Salesman } from 'src/app/models/Salesman';

@Component({
  selector: 'app-salesmen-page',
  templateUrl: './salesmen-page.component.html',
  styleUrls: ['./salesmen-page.component.css']
})
export class SalesmenPageComponent implements OnInit{

  salesmen: Salesman[] = [];


  ngOnInit(): void {

    this.salesmen = []
  }

}
