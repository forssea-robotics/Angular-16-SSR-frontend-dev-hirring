/* eslint-disable @typescript-eslint/ban-types */

import { isPlatformServer } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

// - Services
import { ThrusterService } from '../../services/thruster.service';

// - Models
import { Thruster } from 'src/shared/models/thruster';

@Component({
  selector: 'app-thruster-list-container',
  templateUrl: './thruster-list-container.component.html',
  styleUrls: ['./thruster-list-container.component.scss']
})
export class ThrusterListContainerComponent {

  public thrusterList!: Thruster[];

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _thrusterService: ThrusterService
    ) {
    if(isPlatformServer(this._platformId)) return; // As we are using SSR, we don't want to run this code on the server

    // Initializing the thruster list
    this.thrusterList = [];
    // Connecting to websocket in order to retrieve thruster list from the server
    this._thrusterService.thrusterList$.subscribe((thrusterList: Thruster[]) => {
      this.thrusterList = thrusterList;
    });
  }

}
