import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { Bonuses } from 'src/app/models/Bonuses';

@Component({
  selector: 'app-table-salesman-cabinet',
  templateUrl: './table-salesman-cabinet.component.html',
  styleUrls: ['./table-salesman-cabinet.component.css']
})
export class TableSalesmanCabinetComponent implements OnInit{

  @Input() bonuses: Bonuses[];
  isRejectWindowVisible:boolean = false;
  currentYear: number = new Date().getFullYear();
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;
  private 

public pagingConfig : PaginationInstance = {
    itemsPerPage: this.itemsPerPage,
    currentPage: this.currentPage,
    totalItems: this.totalItems
  };

   constructor(private router: Router){}

  ngOnInit(): void {
    this.totalItems = this.bonuses.length;
  }

  onTableDataChange(event:any){
    this.pagingConfig.currentPage  = event;
  }
  onTableSizeChange(event:any): void {
    this.pagingConfig.itemsPerPage = event.target.value;
    this.pagingConfig.currentPage = 1;
  }

  rejectBonusCalculation(){

  }

  showDetails(){
    this.router.navigate(['edit-bonuses'], {
      state: {
        //TODO - bonuses for one salesman
       // bonuses
      }
  }
  );
  }
}
