import { SalaryData } from './salary-data';
import { WorkGraphicData } from './work-graphic-data';

export class ConditionsData {
  value: string;
  salaryData: SalaryData;
  workGraphicData: WorkGraphicData;
  isHousing: boolean;
  isFood: boolean;

  constructor() {
    this.value = '';
    this.salaryData = new SalaryData();
    this.workGraphicData = new WorkGraphicData();
  }
}
