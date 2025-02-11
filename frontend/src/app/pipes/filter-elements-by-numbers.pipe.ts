import { Pipe, PipeTransform } from '@angular/core';
import { Salesman } from '../models/Salesman';
import { BonusData } from '../models/BonusData';
import { User } from '../models/User';
import { RouterLink } from '@angular/router';
import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core';

@Pipe({
  name: 'filterElementsByNumbers'
})
export class FilterElementsByNumbersPipe implements PipeTransform {

  transform(elements: Object[], properties: string[], searchValues: (number | null)[], type: string): Object[] {

    elements =  elements.filter(element =>
      properties.every((property, index) =>
        searchValues[index] === null || element[property].toString().includes(searchValues[index].toString())
      )
    );

    switch (type) {
      case "BonusData": return elements as BonusData[];
      case "Salesman": return elements as Salesman[];
      case "User": return elements as User[];
      default: return elements; 
    }
  }
}
