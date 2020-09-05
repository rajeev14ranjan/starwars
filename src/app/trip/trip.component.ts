import { Component, OnInit } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd';

@Component({
  selector: 'trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css'],
  providers: []
})
export class TripComponent implements OnInit {
  userInputType = 0;
  userInput = '';
  date = '';
  isEnglish = true;
  constructor(private i18n: NzI18nService) {}

  entryChanged() {}

  demo() {}

  ngOnInit() {}
}
