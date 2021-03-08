import {AdvString} from './string/adv-string';
import {AdvModule} from './module/adv-module';

import {AdvertisementGraphic} from './advertisement-graphic';
import {AdvFormat} from './adv-format';
import {AdvertisementRubric} from './advertisement-rubric';

export class AdvertisementLight {
  orderId: number;
  orderPositionId: number;
  clientId: number;
  clientLegalPersonId: number;
  supplierId: number;
  format: AdvFormat;
  priceId: number;
  rubric: AdvertisementRubric;
  graphics: AdvertisementGraphic[];

  constructor() {
    this.clientId = 0;
    this.clientLegalPersonId = 0;
    this.orderId = 0;
    this.orderPositionId = 0;

    this.format = new AdvFormat();
    this.rubric = new AdvertisementRubric();
    this.graphics = [];
  }
}

export class Advertisement extends AdvertisementLight {
  string: AdvString;
  module: AdvModule;
  childs: Advertisement[];

  constructor() {
    super();
    this.orderId = 0;
    this.orderPositionId = 0;
    this.childs = [];
  }
}
