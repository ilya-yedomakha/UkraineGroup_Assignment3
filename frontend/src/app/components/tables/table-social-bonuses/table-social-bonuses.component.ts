import { Component, Input, OnInit } from '@angular/core';
import { BonusData } from 'src/app/models/BonusData';
import {PaginationInstance} from "ngx-pagination";

@Component({
  selector: 'app-table-social-bonuses',
  templateUrl: './table-social-bonuses.component.html',
  styleUrls: ['./table-social-bonuses.component.css']
})
export class TableSocialBonusesComponent implements OnInit{

  @Input() bonuses: BonusData;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;



  public pagingConfig : PaginationInstance = {
    itemsPerPage: this.itemsPerPage,
    currentPage: this.currentPage,
    totalItems: this.totalItems
  }
  
  ngOnInit(): void {
    this.totalItems = this.bonuses.socialBonuses.length;
  }


  getSocialBonusesTotal(): number {
    return parseInt(this.bonuses.socialBonuses.reduce((sum, ob) => Number(sum) + Number(ob.bonus), 0).toString());
  }

  onTableDataChange(event:any){
    this.pagingConfig.currentPage  = event;
  }

  onTableSizeChange(event:any): void {
    this.pagingConfig.itemsPerPage = event.target.value;
    this.pagingConfig.currentPage = 1;
  }

  saveSocialBonuses(){

  }
}

