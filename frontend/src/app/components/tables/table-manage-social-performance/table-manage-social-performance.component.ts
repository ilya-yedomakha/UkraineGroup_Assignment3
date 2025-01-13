import { Component, Input, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { SocialPerformanceRecord } from 'src/app/models/SocialPerformanceRecord';

@Component({
  selector: 'app-table-manage-social-performance',
  templateUrl: './table-manage-social-performance.component.html',
  styleUrls: ['./table-manage-social-performance.component.css']
})
export class TableManageSocialPerformanceComponent implements OnInit{

  @Input() socialPerformancesRecords: SocialPerformanceRecord[];
  @Input() userRole!: 0 | 1 | 2;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;

  originalValues: { [id: string]: number } = {};

  public pagingConfig : PaginationInstance = {
    itemsPerPage: this.itemsPerPage,
    currentPage: this.currentPage,
    totalItems: this.totalItems
  }
  
  ngOnInit(): void {
    this.totalItems = this.socialPerformancesRecords.length;
    this.socialPerformancesRecords.forEach(record => {
      this.originalValues[record._id] = record.actual_value;
    });
  }

  onTableDataChange(event:any){
    this.pagingConfig.currentPage  = event;
  }

  onTableSizeChange(event:any): void {
    this.pagingConfig.itemsPerPage = event.target.value;
    this.pagingConfig.currentPage = 1;
  }

  onActualValueChange(record: SocialPerformanceRecord, newValue: number) {
    record.actual_value = newValue;
  }

  isSaveDisabled(record: SocialPerformanceRecord): boolean {
    return record.actual_value === this.originalValues[record._id];
  }

  toDeleteSocialPerformanceRecord(_id: string){

  }

  toUpdateSocialPerformanceRecord(socialPerformancesRecord: SocialPerformanceRecord){
    //add update operation
    
    this.originalValues[socialPerformancesRecord._id] = socialPerformancesRecord.actual_value;
  }

  saveSocialPerformances(){

  }
}
