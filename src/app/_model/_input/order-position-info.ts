import {RubricInfo} from './rubric-info';
import {SupplierInfo} from './supplier-info';
import {FormatInfo} from './format-info';
import {GraphicInfo} from './graphic-info';

export class OrderPositionInfo {
  id: number;
  parentId: number;
  supplier: SupplierInfo;
  format: FormatInfo;
  price: number;
  quantity: number;
  nds: number;
  discount: number;
  sum: number;
  graphics: GraphicInfo[];
  rubrics: RubricInfo[];
  isChecked: boolean;
}
