import { Component, OnInit } from '@angular/core';
import { PersonalDetails } from 'src/app/models/PersonalDetails';

@Component({
  selector: 'app-salesmen-page',
  templateUrl: './salesmen-page.component.html',
  styleUrls: ['./salesmen-page.component.css']
})
export class SalesmenPageComponent implements OnInit{

  salesmenDetails: PersonalDetails[] = [];


  ngOnInit(): void {

    this.salesmenDetails = [
      new PersonalDetails(2343, "Bob", "II", "Gerkon", "man", "24-12-2004", "some Address", "+380971923865", "Seniour Salesman",
       "24-09-2003", 4500, "some@gmail.com","Some salesman", "Ukraine1" ),
       new PersonalDetails(2393, "Bob1", "II", "Gerkon", "man", "24-12-2004", "some Address", "+380991923865", "Seniour Salesman",
       "24-09-2003", 4500, "some@gmail.com","Some salesman", "Ukraine2" ),
       new PersonalDetails(2393, "Bob1", "II", "Gerkon", "man", "24-12-2004", "some Address", "+380991923865", "Seniour Salesman",
       "24-09-2003", 4500, "some@gmail.com","Some salesman", "Ukraine3" ),
       new PersonalDetails(2393, "Bob1", "II", "Gerkon", "man", "24-12-2004", "some Address", "+380991923865", "Seniour Salesman",
       "24-09-2003", 4500, "some@gmail.com","Some salesman", "Ukraine4" ),
       new PersonalDetails(2393, "Bob1", "II", "Gerkon", "man", "24-12-2004", "some Address", "+380991923865", "Seniour Salesman",
       "24-09-2003", 4500, "some@gmail.com","Some salesman", "Ukraine5" ),
    ]
  }

}
