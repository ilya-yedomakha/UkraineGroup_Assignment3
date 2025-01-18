import {Component, inject} from '@angular/core';
import {BonusesService} from "../../services/bonuses.service";
import { UserService } from 'src/app/services/user.service';
import { SalesmanService } from 'src/app/services/salesman.service';
import { User } from 'src/app/models/User';

@Component({
    selector: 'app-welcome-admin-dashboard',
    templateUrl: './welcome-admin-dashboard.component.html',
    styleUrls: ['./welcome-admin-dashboard.component.css']
})
export class WelcomeAdminDashboardComponent {
    signedReportsByCEOForCurrentYearCount = 23
    signedReportsByHRForCurrentYearCount = 56
    reportsForCurrentYearCount: number = 120;
    reportsCount: number = 450;
    usersCount: number = 300;
    salesmenCount: number = 50;
    salesForCurrentYearCount: number = 12345;
    rejectionsForCurrentYearCount: number = 25;

    signatureByPieLable: string = "Number of reports"
    numberOfSignaturesByCeo: [number, number];
    numberOfSignaturesByHr: [number, number];
    signatureByCeoPieLables: string[] = ["Number of signed reports by CEO", "Number of unsigned reports by CEO"]
    signatureByHrPieLables: string[] = ["Number of signed reports by HR", "Number of unsigned reports by HR"]
    
    bonuses = [34,43,23,42,43,53,33]
    salesmenFullname = ["some0", "some1", "some3", "some4", "somet", "some5", "some6"]

    private bonusesService = inject(BonusesService);
    private userService: UserService = inject(UserService);
    private salesmanService: SalesmanService = inject(SalesmanService);
    user:User;
    updatingIsLoading: boolean = false;

    ngOnInit(): void {
        this.fetchUser();


        this.numberOfSignaturesByCeo = [this.signedReportsByCEOForCurrentYearCount,
             this.reportsForCurrentYearCount - this.signedReportsByCEOForCurrentYearCount]

        this.numberOfSignaturesByHr = [this.signedReportsByHRForCurrentYearCount,
            this.reportsForCurrentYearCount - this.signedReportsByHRForCurrentYearCount]
    }


    updateData(){
        //TODO об'єднати два subscribe 
        this.updatingIsLoading = true;

        //this.salesmanService.importSeniorSalesmenFromOrangeHRM().subscribe(()=>{
         //   this.updatingIsLoading = false;
       /// });

    

    }

    fetchUser() {
        this.userService.getOwnUser().subscribe((user): void => {
            this.user = user;
        });
    }
}
