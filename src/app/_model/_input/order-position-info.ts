import {RubricInfo} from './rubric-info';
import {SupplierInfo} from './supplier-info';
import {FormatInfo} from './format-info';
import {GraphicInfo} from './graphic-info';
import { PriceInfo } from './price-info';
import { ImageInfo } from './image-info';
import { StringInfo } from './string-info';

export class OrderPositionInfo {
  id: number;
  orderId: number;
  parentId: number;
  supplier: SupplierInfo;
  format: FormatInfo;
  price: PriceInfo;
  cost: number;
  quantity: number;
  nds: number;
  discount: number;
  sum: number;
  graphics: GraphicInfo[];
  rubrics: RubricInfo[];
  isChecked: boolean;
  module: ImageInfo;
  string: StringInfo;
  childs: OrderPositionInfo[];
}
