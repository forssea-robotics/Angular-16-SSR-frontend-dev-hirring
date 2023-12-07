import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// -- Modules
import { SharedModule } from 'src/shared/shared.module';

// -- Services
import { RadioService } from './services/radio.service';
import { ThrusterService } from './services/thruster.service';

// -- Components
import { AppComponent } from './app.component';
import { RadioComponent } from './components/radio/radio.component';
import { ThrusterListContainerComponent } from './components/thruster-list-container/thruster-list-container.component';
import { ThrusterComponent } from './components/thruster/thruster.component';

@NgModule({
  declarations: [
    AppComponent,
    ThrusterListContainerComponent,
    ThrusterComponent,
    RadioComponent
  ],
  imports: [
    SharedModule,
    HttpClientModule
  ],
  providers: [ ThrusterService, RadioService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
