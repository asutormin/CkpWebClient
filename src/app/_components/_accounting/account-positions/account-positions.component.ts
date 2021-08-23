import { Component, Input, OnInit } from '@angular/core';
import { AccountPositionInfo } from 'src/app/_model/_input/account-position-info';

@Component({
  selector: 'app-account-positions',
  templateUrl: './account-positions.component.html',
  styleUrls: ['./account-positions.component.scss']
})
export class AccountPositionsComponent implements OnInit {
  @Input() public accountPositions: AccountPositionInfo[]

  constructor() { }

  ngOnInit(): void {
  }

}
