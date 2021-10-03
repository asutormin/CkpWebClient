import { Pipe, PipeTransform } from '@angular/core';
import { GraphicInfo } from '../_model/_input/graphic-info';

@Pipe({ name: 'graphicsStringified' })
export class GraphicsStringifyPipe implements PipeTransform {
  transform(graphics: GraphicInfo[], showYear: boolean = false) {
    function groupBy(list, keyGetter) {
      const map = new Map();
      list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    }

    const graphicGroups = groupBy(graphics, g => g.id);
    const formattedOutDates = [];

    for (const graphicGroup of graphicGroups.values()) {
      const graphicArray = graphicGroup as GraphicInfo[];
      const count = graphicArray.length;
      const outDate = new Date(graphicArray[0].outDate);

      const formattedOutDate = showYear
      ? ('00' + outDate.getDate()).slice(-2) + '.' + ('00' + (outDate.getMonth() + 1)).slice(-2) + '.' + outDate.getFullYear() + '(' + count + ')'
      : ('00' + outDate.getDate()).slice(-2) + '.' + ('00' + (outDate.getMonth() + 1)).slice(-2) + '(' + count + ')';
      formattedOutDates.push(formattedOutDate);
    }

    return formattedOutDates.join('; ');
  }

}
