import {Rubric} from './rubric';
import {Company} from './company';
import {Format} from './format';
import {Graphic} from './graphic';

export class Position {
  id: number;
  parentId: number;
  supplier: Company;
  format: Format;
  price: number;
  quantity: number;
  nds: number;
  discount: number;
  sum: number;
  graphics: Graphic[];
  rubrics: Rubric[];
  isChecked: boolean;
}
