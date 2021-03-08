import {Pipe, PipeTransform} from '@angular/core';
import {Rubric} from '../_model/rubric';

@Pipe({name: 'rubricsStringified'})
export class RubricsStringifiedPipe implements PipeTransform {
  transform(rubrics: Rubric[]): string {
    const rubricsStr = [];
    rubrics.forEach(r => {
      const rubricStr = r.number + ' - ' + r.name;
      rubricsStr.push(rubricStr);
    });
    const result = rubricsStr.join(', ');
    return  result;
  }
}
