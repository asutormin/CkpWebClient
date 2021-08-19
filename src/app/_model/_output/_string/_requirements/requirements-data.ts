import { AgeData } from './age-data';
import { ExperienceData } from './experience-data';

export class RequirementsData {
  value: string;
  ageData: AgeData;
  genderId: number;
  educationId: number;
  citizenshipId: number;
  experienceData: ExperienceData;

  constructor() {
    this.value = '';
    this.ageData = new AgeData();
    this.experienceData = new ExperienceData();
  }
}
