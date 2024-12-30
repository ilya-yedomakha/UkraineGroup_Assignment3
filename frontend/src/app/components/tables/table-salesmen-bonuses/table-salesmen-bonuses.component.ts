import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { BonusData } from 'src/app/models/BonusData';

@Component({
  selector: 'app-table-salesmen-bonuses',
  templateUrl: './table-salesmen-bonuses.component.html',
  styleUrls: ['./table-salesmen-bonuses.component.css']
})
export class TableSalesmenBonusesComponent  implements OnInit{

  @Input() bonuses: BonusData[];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;


  constructor(private router: Router){}

  public pagingConfig : PaginationInstance = {
    itemsPerPage: this.itemsPerPage,
    currentPage: this.currentPage,
    totalItems: this.totalItems
  };

  ngOnInit(): void {
    this.totalItems = this.bonuses.length;
  }

  toEditSalesmanBonus(bonuse: BonusData){
    this.router.navigate(['edit-bonuses'],{
      state: {
        bonuse:bonuse
      }
    }

    )
  }

  onTableDataChange(event:any){
    this.pagingConfig.currentPage  = event;
  }
  onTableSizeChange(event:any): void {
    this.pagingConfig.itemsPerPage = event.target.value;
    this.pagingConfig.currentPage = 1;
  }

}
