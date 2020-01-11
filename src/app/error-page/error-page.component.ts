import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {
  constructor(private _title: Title, private _router: Router) {
    this._title.setTitle('Page Not found');
  }

  public goTo(url: string) {
    this._router.navigateByUrl(url);
  }
}
