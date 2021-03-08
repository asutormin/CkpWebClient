import {AdvRequirements} from './requirements/adv-requirements';
import {AdvConditions} from './conditions/adv-conditions';
import {AdvContact} from './adv-contact';
import {AdvLogo} from './adv-logo';
import {AdvPhone} from './adv-phone';
import {AdvEmail} from './adv-email';
import {AdvAddress} from './adv-address';
import {AdvOccurrence} from './adv-occurrence';

export class AdvString {
  id: number;
  date: Date;
  vacancyName: string;
  vacancyAdditional: string;
  requirements: AdvRequirements;
  responsibility: string;
  conditions: AdvConditions;
  contact: AdvContact;
  logo: AdvLogo;

  phones: AdvPhone[];
  emails: AdvEmail[];
  addresses: AdvAddress[];
  occurrences: AdvOccurrence[];

  constructor() {
    this.vacancyName = '';
    this.vacancyAdditional = '';
    this.requirements = new AdvRequirements();
    this.conditions = new AdvConditions();
    this.responsibility = '';

    this.contact = new AdvContact();
    this.phones = [];
    this.emails = [];
    this.addresses = [];
    this.occurrences = [];
    // this.occurrences.push(new AdvOccurrence());

    this.logo = new AdvLogo();
  }
}
