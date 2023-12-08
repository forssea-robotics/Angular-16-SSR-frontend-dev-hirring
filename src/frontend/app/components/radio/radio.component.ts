/* eslint-disable @typescript-eslint/ban-types */
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent {

  // TODO: Exercice 2

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    if(isPlatformServer(this._platformId)) return; // As we are using SSR, we don't want to run this code on the server
  }

}
