import {Component, inject} from '@angular/core';
import {BonusesService} from "../../services/bonuses.service";

@Component({
    selector: 'app-welcome-admin-dashboard',
    templateUrl: './welcome-admin-dashboard.component.html',
    styleUrls: ['./welcome-admin-dashboard.component.css']
})
export class WelcomeAdminDashboardComponent {
    signedReportsByCEOForCurrentYearCount
    signedReportsByHRForCurrentYearCount
    reportsForCurrentYearCount
    reportsCount
    usersCount
    salesmenCount
    salesForCurrentYearCount
    rejectionsForCurrentYearCount
    private bonusesService = inject(BonusesService);

    constructor() {
    }


    signatureByPieLable: string = "Number of reports"

    signatureByCeoPieLables: string[] = ["Number of signed reports by CEO", "Number of unsigned reports by CEO"]
    numberOfSignaturesByCeo: [number, number] = [34, 4]

    signatureByHrPieLables: string[] = ["Number of signed reports by HR", "Number of unsigned reports by HR"]
    numberOfSignaturesByHr: [number, number] = [65, 6]
    bonuses = [34,43,23,42,43,53,33]
    salesmenFullname = ["some0", "some1", "some3", "some4", "somet", "some5", "some6"]

    ngOnInit(): void {

    }
}
