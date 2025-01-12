import { Component, Input, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { BonusData } from 'src/app/models/BonusData';

@Component({
  selector: 'app-table-orders-bonuses',
  templateUrl: './table-orders-bonuses.component.html',
  styleUrls: ['./table-orders-bonuses.component.css']
})
export class TableOrdersBonusesComponent implements OnInit {

  @Input() bonuses: BonusData;
  @Input() userRole!: 0 | 1 | 2;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;

  public pagingConfig: PaginationInstance = {
    itemsPerPage: this.itemsPerPage,
    currentPage: this.currentPage,
    totalItems: this.totalItems
  }
  
  ngOnInit(): void {
    this.totalItems = this.bonuses.ordersBonuses.length;
  }

  getOrderBonusesTotal(): number {
    return parseInt(this.bonuses.ordersBonuses.reduce((sum, ob) => sum + ob.bonus, 0).toString());
  }

  onTableDataChange(event: any) {
    this.pagingConfig.currentPage = event;
  }

  onTableSizeChange(event: any): void {
    this.pagingConfig.itemsPerPage = event.target.value;
    this.pagingConfig.currentPage = 1;
  }

  //TODO
  saveSalesBonuses() {

  }

}
