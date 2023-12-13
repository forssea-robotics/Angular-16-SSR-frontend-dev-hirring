/* eslint-disable @typescript-eslint/ban-types */
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RadioService {

  // TODO: Exercice 2

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _http: HttpClient
  ) {
    if(isPlatformServer(this._platformId)) return; // As we are using SSR, we don't want to run this code on the server

  }
}
