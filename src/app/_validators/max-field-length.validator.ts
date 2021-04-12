import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';

@Directive({
  selector: '[appMaxFieldLength]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxFieldLengthValidateDirective, multi: true }
    ]
})
export class MaxFieldLengthValidateDirective implements Validator {
  @Input() public maxFieldLength: number;

  validate(control: AbstractControl): {[key: string]: any} | null {
    if (this.maxFieldLength.toString() === '') {
      return null;
    }

    if (control.value && control.value.length > this.maxFieldLength) {
      return { maxLengthInvalid: true };
    }
    return null;
  }
}
