import {ModuleParamsBase} from './module-params-base';
import {ModulePartParams} from './module-part-params';

export class ModuleParamsStandard extends ModuleParamsBase {
  header: ModulePartParams;
  body: ModulePartParams;
  footer: ModulePartParams;

  backgroundImage: string;

  constructor() {
    super();
    this.header = new ModulePartParams();
    this.body = new ModulePartParams();
    this.footer = new ModulePartParams();
  }
}
