import { StringData } from './_string/string-data';
import { ModuleData } from './_module/module-data';

import { GraphicData } from './graphic-data';
import { FormatData } from './format-data';
import { RubricData } from './rubric-data';

export class OrderPositionDataLight {
  orderId: number;
  orderPositionId: number;
  clientId: number;
  clientLegalPersonId: number;
  supplierId: number;
  formatData: FormatData;
  priceId: number;
  rubricData: RubricData;
  graphicsData: GraphicData[];

  constructor() {
    this.clientId = 0;
    this.clientLegalPersonId = 0;
    this.orderId = 0;
    this.orderPositionId = 0;

    this.formatData = new FormatData();
    this.rubricData = new RubricData();
    this.graphicsData = [];
  }
}

export class OrderPositionData extends OrderPositionDataLight {
  stringData: StringData;
  moduleData: ModuleData;
  childs: OrderPositionData[];

  constructor() {
    super();
    this.orderId = 0;
    this.orderPositionId = 0;
    this.childs = [];
  }
}
