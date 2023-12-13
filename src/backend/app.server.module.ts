import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

// - Modules
import { AppModule } from '../frontend/app/app.module';

// Services
import { APIRadioService } from './services/api-radio.service';
import { APIThrusterService } from './services/api-thruster.service';

// - Component
import { AppComponent } from '../frontend/app/app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [APIRadioService, APIThrusterService],
})
export class AppServerModule {

  constructor(
    apiRadioService: APIRadioService,
    apiThruserService: APIThrusterService
  ) {
    //
  }
}
