import { Component, OnInit } from '@angular/core';
import {PeopleDemoService} from '../../services/people-demo.service';
import {ExampleDatapoint} from '../../interfaces/example-datapoint';

@Component({
    selector: 'app-example-page',
    templateUrl: './example-page.component.html',
    styleUrls: ['./example-page.component.css']
})
export class ExamplePageComponent implements OnInit {

    displayedColumns = ['id', 'name', 'color', 'age'];
    people: ExampleDatapoint[] = [];

    constructor(private peopleDemoService: PeopleDemoService) { }

    ngOnInit(): void {
        this.fetchPeople();
    }

    fetchPeople(): void{
        this.peopleDemoService.getPeople().subscribe((response): void => {
            if (response.status === 200){
                this.people = response.body;
            }
        });
    }
}
