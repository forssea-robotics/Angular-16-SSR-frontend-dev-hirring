/* eslint-disable @typescript-eslint/ban-types */
import { formatDate, isPlatformServer } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { map, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'rocketx-hmi';
  public browserTimeStr?: string;
  public browserDateStr?: string;

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    if(isPlatformServer(this._platformId)) return; // As we are using SSR, we don't want to run this code on the server

    // Get the current browser (a.k.a system) time every seconds
    timer(0, 1000)
      .pipe(
        map(() => new Date())
      ).subscribe(this._generateDateStr.bind(this));
  }

  private _generateDateStr(date: Date): void {
    this.browserTimeStr = this._dateToHourMinutesSeconds(date);
    this.browserDateStr = this._dateToYearMonthDay(date);
  }

  private _dateToHourMinutesSeconds(date: Date): string {
    return formatDate(date, 'hh:mm:ss a', 'en-EN');
  }

  private _dateToYearMonthDay(date: Date): string {
    return formatDate(date, 'YYYY-MM-dd', 'en-EN');
  }
}
