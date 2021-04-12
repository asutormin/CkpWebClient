import * as stringConfig from 'src/assets/string-config.json';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class StringConfigService {

  public getVisibility(supplierId: number, formatId: number, fieldName: string): boolean {
    const field = this.getElement(supplierId, formatId, fieldName);
    return field === undefined ? false : true;
  }

  public getLength(supplierId: number, formatId: number, fieldName: string): any {
    const element = this.getElement(supplierId, formatId, fieldName);

    if (element === undefined) {
      return undefined;
    }

    return element.length;
  }

  public getTotalLength(supplierId: number, formatId: number, fieldName: string): any {
    const element = this.getElement(supplierId, formatId, fieldName);

    if (element === undefined) {
      return undefined;
    }

    return element.totalLength;
  }

  public getCount(supplierId: number, formatId: number, fieldName: string): any {
    const element = this.getElement(supplierId, formatId, fieldName);

    if (element === undefined) {
      return undefined;
    }

    return element.count;
  }

  private getElement(supplierId: number, formatId: number, elementName: string): any {
    const getElement = (elmnts: any[], name): any => {
      let result: any;
      for (const e of elmnts) {
        if (e.name === name) {
          result = e;
        } else {
          if (e.elements !== undefined) {
            const res = getElement(e.elements, name);
            if (res !== undefined) {
              result = res;
            }
          }
        }
      }
      return result;
    };

    const supplier = stringConfig.suppliers.map(su => su.supplier).find(su => su.id === supplierId);
    if (supplier === undefined) {
      return undefined;
    }

    const formats = supplier.formats;
    if (formats === undefined) {
       return undefined;
    }

    const format = formats.find(f => f.format.id === formatId).format;
    if (format === undefined) {
      return undefined;
    }

    const elements = format.elements;
    if (elements === undefined) {
      return undefined;
    }

    const element = getElement(elements, elementName);
    return element;
  }

}
