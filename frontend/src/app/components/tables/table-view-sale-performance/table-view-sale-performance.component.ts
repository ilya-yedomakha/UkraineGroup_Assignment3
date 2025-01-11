import { Component, Input, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { SalePerformanceRecord } from 'src/app/models/SalePerformanceRecord';

@Component({
  selector: 'app-table-view-sale-performance',
  templateUrl: './table-view-sale-performance.component.html',
  styleUrls: ['./table-view-sale-performance.component.css']
})
export class TableViewSalePerformanceComponent implements OnInit {

  @Input() salePerformanceRecords: SalePerformanceRecord[];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;

  public pagingConfig: PaginationInstance = {
    itemsPerPage: this.itemsPerPage,
    currentPage: this.currentPage,
    totalItems: this.totalItems
  }
  
  ngOnInit(): void {
    this.totalItems = this.salePerformanceRecords.length;
  }

  onTableDataChange(event: any) {
    this.pagingConfig.currentPage = event;
  }

  onTableSizeChange(event: any): void {
    this.pagingConfig.itemsPerPage = event.target.value;
    this.pagingConfig.currentPage = 1;
  }

}
