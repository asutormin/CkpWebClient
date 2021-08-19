import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RubricInfo } from '../../../_model/_input/rubric-info';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-rubrics',
  templateUrl: './rubrics.component.html',
  styleUrls: ['./rubrics.component.scss']
})
export class RubricsComponent implements OnInit {

  @ViewChild('f') private form: NgForm;

  @Input() public submitted = false;
  @Input() public enabled = true;
  @Output() public rubricChanged = new EventEmitter<RubricInfo>();

  public rubrics: RubricInfo[];
  public currentRubric: RubricInfo;

  public get Valid(): boolean {
    return this.submitted && this.currentRubric !== undefined;
  }

  constructor() { }

  public ngOnInit(): void {
  }

  public setRubrics(rubrics: RubricInfo[]): void {
    this.rubrics = rubrics;
  }

  public setCurrentRubric(rubric: RubricInfo): void {
    this.currentRubric = rubric;
  }

  public onRubricChanged(): void {
    this.rubricChanged.emit(this.currentRubric);
  }

}
