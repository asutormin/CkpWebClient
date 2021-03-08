import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';

@Directive({
  selector: '[appMaxSelect2Count]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxSelect2CountValidateDirective, multi: true }
  ]
})
export class MaxSelect2CountValidateDirective implements Validator {

  @Input() public maxSelect2Count: number;

  validate(control: AbstractControl): {[key: string]: any} | null {

    if (this.maxSelect2Count.toString() === '') {
      return null;
    }

    if (!control.value) {
      return;
    }

    if (control.value.length > this.maxSelect2Count) {
      return { maxCountInvalid: true }; // return object if the validation is not passed.
    }
    return null; // return null if validation is passed.
  }
}
