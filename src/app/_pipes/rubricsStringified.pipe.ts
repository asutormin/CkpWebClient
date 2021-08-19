import { Pipe, PipeTransform } from '@angular/core';
import { RubricInfo } from '../_model/_input/rubric-info';

@Pipe({ name: 'rubricsStringified' })
export class RubricsStringifiedPipe implements PipeTransform {
  transform(rubrics: RubricInfo[]): string {
    const rubricsStr = [];
    rubrics.forEach(r => {
      const rubricStr = r.number + ' - ' + r.name;
      rubricsStr.push(rubricStr);
    });
    const result = rubricsStr.join(', ');
    return result;
  }
}
