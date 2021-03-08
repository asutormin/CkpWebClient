import {AdvSalary} from './adv-salary';
import {AdvWorkGraphic} from './adv-work-graphic';

export class AdvConditions {
  value: string;
  salary: AdvSalary;
  workGraphic: AdvWorkGraphic;
  isHousing: boolean;
  isFood: boolean;

  constructor() {
    this.value = '';
    this.salary = new AdvSalary();
    this.workGraphic = new AdvWorkGraphic();
  }
}
