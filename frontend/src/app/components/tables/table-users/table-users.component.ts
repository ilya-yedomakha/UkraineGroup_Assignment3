import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {PaginationInstance} from "ngx-pagination";
import {User} from "../../../models/User";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.css']
})
export class TableUsersComponent implements OnInit {
    @Input() users: User[];
    @Output() userCodeUpdate = new EventEmitter<number>();
    currentPage = 1;
    itemsPerPage = 8;
    totalItems = 0;

    private userService = inject(UserService)

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

    getRoleName(role: number): string {
        switch (role) {
            case 0: return 'CEO';
            case 1: return 'HR';
            case 2: return 'Salesman';
        }
        return '';
    }

    deletUser(code: number) {
        this.userService.deletingUser(code).subscribe(()=>
        {
            this.users = this.users.filter((user) => user.code !== code);
        })
    }

    editUser(code: number) {
        this.userCodeUpdate.emit(code);
    }
}
