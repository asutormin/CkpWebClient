import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Rubric} from '../../../_model/rubric';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-rubrics',
  templateUrl: './rubrics.component.html',
  styleUrls: ['./rubrics.component.scss']
})
export class RubricsComponent implements OnInit {

  @ViewChild('f') private form: NgForm;

  @Input() public submitted = false;
  @Input() public enabled = true;
  @Output() public rubricChanged = new EventEmitter<Rubric>();

  public rubrics: Rubric[];
  public currentRubric: Rubric;

  public get Valid(): boolean {
    return this.submitted && this.currentRubric !== undefined;
  }

  constructor() { }

  public ngOnInit(): void {
  }

  public setRubrics(rubrics: Rubric[]): void {
    this.rubrics = rubrics;
  }

  public setCurrentRubric(rubric: Rubric): void {
    this.currentRubric = rubric;
  }

  public onRubricChanged(): void {
    this.rubricChanged.emit(this.currentRubric);
  }

}
