/* eslint-disable @typescript-eslint/ban-types */

import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

// - Models
import { Thruster } from 'src/shared/models/thruster';

// - API Path
import { API_PATH_THRUSTER_LIST } from 'src/shared/constants/constants-path';

@Injectable({
  providedIn: 'root'
})
export class ThrusterService {

  private _thrusterList!: BehaviorSubject<Thruster[]>;
  get thrusterList$(): Observable<Thruster[]> {
    return this._thrusterList.asObservable();
  }

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _http: HttpClient
    ) {
    if(isPlatformServer(this._platformId)) return; // As we are using SSR, we don't want to run this code on the server

    // Initializing data
    this._thrusterList = new BehaviorSubject<Thruster[]>([]);

    // Connecting to websocket in order to retrieve thruster list from the server
    webSocket<Thruster[]>({
      url: `ws://${location.host}${API_PATH_THRUSTER_LIST}`,
    })
    .subscribe((thrusterListState: Thruster[]) => this._thrusterList.next(thrusterListState));
  }

  /**
   * Update the power on/off of one specific thruster by its Id
   * @param { Number } id - Id of the thruster to update
   * @param { Boolean } powerOn - Power on/off status of the thruster to update
   */
  public updateOneThrusterPowerById(id: number, powerOn: boolean): void {
    const path = `${API_PATH_THRUSTER_LIST}/${id}`;
    this._http.put(path, { powerOn }, { observe: 'response' }).subscribe();
  }

}
