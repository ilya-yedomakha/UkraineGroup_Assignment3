import { Component, Input, OnInit } from '@angular/core';
import { PersonalDetails } from 'src/app/models/PersonalDetails';
import {PaginationInstance} from "ngx-pagination";


@Component({
  selector: 'app-table-salesmen',
  templateUrl: './table-salesmen.component.html',
  styleUrls: ['./table-salesmen.component.css']
})
export class TableSalesmenComponent implements OnInit {

  @Input() salesmenPersonalDetails: PersonalDetails[];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;



  public pagingConfig : PaginationInstance = {
    itemsPerPage: this.itemsPerPage,
    currentPage: this.currentPage,
    totalItems: this.totalItems
  }
  
  ngOnInit(): void {
    this.totalItems = this.salesmenPersonalDetails.length;
  }


  onTableDataChange(event:any){
    this.pagingConfig.currentPage  = event;
  }

  onTableSizeChange(event:any): void {
    this.pagingConfig.itemsPerPage = event.target.value;
    this.pagingConfig.currentPage = 1;
  }

  toAddSocialPerformance(){

  }

  toShowSalesmanInfo(){

  }
}
