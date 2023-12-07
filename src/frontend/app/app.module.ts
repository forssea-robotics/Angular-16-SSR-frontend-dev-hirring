import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// -- Modules
import { SharedModule } from 'src/shared/shared.module';

// -- Services
import { ThrusterService } from './services/thruster.service';

// -- Components
import { AppComponent } from './app.component';
import { ThrusterListContainerComponent } from './components/thruster-list-container/thruster-list-container.component';
import { ThrusterComponent } from './components/thruster/thruster.component';

@NgModule({
  declarations: [
    AppComponent,
    ThrusterListContainerComponent,
    ThrusterComponent,
  ],
  imports: [
    SharedModule,
    HttpClientModule
  ],
  providers: [ThrusterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
