import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wait-line',
  templateUrl: './wait-line.component.html',
  styleUrls: ['./wait-line.component.scss']
})
export class WaitLineComponent implements OnInit {

  @Input()
  public isAnimated: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
