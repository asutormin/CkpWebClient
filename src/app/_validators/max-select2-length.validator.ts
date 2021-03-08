import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';

@Directive({
  selector: '[appMaxSelect2Length]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxSelect2LengthValidateDirective, multi: true }
  ]
})
export class MaxSelect2LengthValidateDirective implements Validator {

  @Input() public maxSelect2Length: number;

  validate(control: AbstractControl): {[key: string]: any} | null {

    if (this.maxSelect2Length.toString() === '') {
      return null;
    }

    if (!control.value) {
      return;
    }

    let length = 0;
    control.value.forEach(val => length += JSON.parse(val).name.length);

    if (length > this.maxSelect2Length) {
      return { maxLengthInvalid: true }; // return object if the validation is not passed.
    }
    return null; // return null if validation is passed.
  }
}
