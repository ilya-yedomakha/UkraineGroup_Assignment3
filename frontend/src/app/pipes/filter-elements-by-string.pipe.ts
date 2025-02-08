import { Pipe, PipeTransform } from '@angular/core';
import { BonusData } from '../models/BonusData';

@Pipe({
  name: 'filterElementsByString'
})
export class FilterElementsByStringPipe implements PipeTransform {

  transform(elements: BonusData[], properties: string[], searchValues: string[]): BonusData[] {


    const filteredSearchValues = searchValues.map(s => s.trim());

    if (filteredSearchValues.every(s => s.length === 0)) {
      return elements;
    }

    return elements.filter(element =>
      properties.some((property, index) =>
        filteredSearchValues[index]?.length > 0 &&
        element[property]?.toString().toLowerCase().includes(filteredSearchValues[index].toLowerCase())
      )
    );
  }
}
