import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 
  constructor(
    public userService: UserService
  ) { }

  ngOnInit() {
    console.log(this.userService.currentUserValue);
  }

}
