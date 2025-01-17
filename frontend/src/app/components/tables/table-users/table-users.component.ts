import {Component, Input} from '@angular/core';
import {Salesman} from "../../../models/Salesman";
import {PaginationInstance} from "ngx-pagination";
import {User} from "../../../models/User";

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.css']
})
export class TableUsersComponent {
    @Input() users: User[];
    currentPage = 1;
    itemsPerPage = 8;
    totalItems = 0;



    public pagingConfig: PaginationInstance = {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        totalItems: this.totalItems
    };

    ngOnInit(): void {
        this.totalItems = this.users.length;
    }


    onTableDataChange(event: any){
        this.pagingConfig.currentPage  = event;
    }

    onTableSizeChange(event: any): void {
        this.pagingConfig.itemsPerPage = event.target.value;
        this.pagingConfig.currentPage = 1;
    }
}
