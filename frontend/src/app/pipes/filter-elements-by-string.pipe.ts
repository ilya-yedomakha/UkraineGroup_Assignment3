import { Pipe, PipeTransform } from '@angular/core';
import { BonusData } from '../models/BonusData';
import { Salesman } from '../models/Salesman';

@Pipe({
  name: 'filterElementsByString'
})
export class FilterElementsByStringPipe implements PipeTransform {

  transform(elements: Object[], properties: string[], searchValues: string[], type: string): Object[] {


    const filteredSearchValues = searchValues.map(s => s.trim());

    if (filteredSearchValues.every(s => s.length === 0)) {
      return elements;
    }
    
    elements = elements.filter(element =>
      properties.every((property, index) =>
        filteredSearchValues[index].length === 0 || (filteredSearchValues[index].length > 0 &&
        element[property].toString().toLowerCase().includes(filteredSearchValues[index].toLowerCase()))
      )
    );

    switch (type) {
      case "BonusData": return elements as BonusData[];
      case "Salesman": return elements as Salesman[];
      default: return elements; 
    }
}
}
