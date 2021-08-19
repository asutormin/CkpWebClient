import {RequirementsData} from './_requirements/requirements-data';
import {ConditionsData} from './_conditions/conditions-data';
import {ContactData} from './contact-data';
import {LogoData} from './logo-data';
import {PhoneData} from './phone-data';
import {EmailData} from './email-data';
import {AddressData} from './address-data';
import {OccurrenceData} from './occurrence-data';

export class StringData {
  id: number;
  date: Date;
  anonymousCompanyName: string;
  vacancyName: string;
  vacancyAdditional: string;
  requirementsData: RequirementsData;
  responsibility: string;
  conditionsData: ConditionsData;
  contactData: ContactData;
  logoData: LogoData;

  phonesData: PhoneData[];
  emailsData: EmailData[];
  addressesData: AddressData[];
  occurrencesData: OccurrenceData[];

  constructor() {
    this.anonymousCompanyName = '';
    this.vacancyName = '';
    this.vacancyAdditional = '';
    this.requirementsData = new RequirementsData();
    this.conditionsData = new ConditionsData();
    this.responsibility = '';

    this.contactData = new ContactData();
    this.phonesData = [];
    this.emailsData = [];
    this.addressesData = [];
    this.occurrencesData = [];

    this.logoData = new LogoData();
  }
}
