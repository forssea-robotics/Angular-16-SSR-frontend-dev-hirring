/* eslint-disable @typescript-eslint/ban-types */
import { isPlatformServer } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';

// - Models
import { Thruster } from 'src/shared/models/thruster';
import { ThrusterService } from '../../services/thruster.service';

@Component({
  selector: 'app-thruster',
  templateUrl: './thruster.component.html',
  styleUrls: ['./thruster.component.scss']
})
export class ThrusterComponent {

  @Input() thruster?: Thruster;

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _thrusterService: ThrusterService
  ) {
    if(isPlatformServer(this._platformId)) return; // As we are using SSR, we don't want to run this code on the server
  }

  /**
   * Send the updated thruster state to the service
   * @returns { void }
   */
  onThrusterChange(): void {
    if(this.thruster === undefined) return;

    this._thrusterService.updateOneThrusterPowerById(this.thruster.id, this.thruster.powerOn);
  }

}
