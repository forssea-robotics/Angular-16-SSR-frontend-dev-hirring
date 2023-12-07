import { NgModule } from '@angular/core';

// -- Modules
import { SharedModule } from 'src/shared/shared.module';

// -- Components
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
