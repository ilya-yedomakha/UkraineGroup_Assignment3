import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {PaginationInstance} from "ngx-pagination";
import {User} from "../../../models/User";
import {UserService} from "../../../services/user.service";
import {SnackBarService} from "../../../services/snack-bar.service";

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
    roles: string[]  = ["admin", "hr", "salesman"];
    rolesforFilter: { label: string, value: number }[] = [
        {label: 'CEO', value: 0},
        {label: 'HR', value: 1},
        {label: 'Salesman', value: 2}
    ];

    filterUsername: string  = "";
    filterFirstName: string = "";
    filterEmail: string = "";
    filterRole: number = null;
    filterLastName: string = "";
    filterCode: number = null;


    private userService = inject(UserService)
    private snackBar = inject(SnackBarService);

    public pagingConfig: PaginationInstance = {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        totalItems: this.totalItems
    };

    ngOnInit(): void {
        this.totalItems = this.users.length;
    }


    onTableDataChange(event: any) {
        this.pagingConfig.currentPage = event;
    }

    onTableSizeChange(event: any): void {
        this.pagingConfig.itemsPerPage = event.target.value;
        this.pagingConfig.currentPage = 1;
    }

    getRoleName(role: number): string {
        switch (role) {
            case 0:
                return 'CEO';
            case 1:
                return 'HR';
            case 2:
                return 'Salesman';
        }
        return '';
    }

    deleteUser(code: number) {
        this.userService.deletingUser(code).subscribe({
            next: () => {
                this.users = this.users.filter((user) => user.code !== code);
                this.snackBar.showSnackBar('User deleted successfully');
            },
            error: (err): void => this.snackBar.showSnackBar('Error: ' + err.error?.message),
        });
    }

    editUser(code: number) {
        this.userCodeUpdate.emit(code);
    }

    clearFiltersInputs() {  
        this.filterUsername  = "";
        this.filterFirstName = "";
        this.filterEmail = "";
        this.filterRole = null;
        this.filterLastName = "";
        this.filterCode = null;
    }
}
