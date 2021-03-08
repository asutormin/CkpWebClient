import {AdvAge} from './adv-age';
import {AdvExperience} from './adv-experience';

export class AdvRequirements {
  value: string;
  age: AdvAge;
  genderId: number;
  educationId: number;
  citizenshipId: number;
  experience: AdvExperience;

  constructor() {
    this.value = '';
    this.age = new AdvAge();
    this.experience = new AdvExperience();
  }
}
