import { NgModule } from '@angular/core';

// -- Button
import { MatButtonModule } from '@angular/material/button';

// -- Toggle
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Progress Bar & Slider
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';

// -- Form & input
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';



const materialModules = [
	MatButtonModule,
	MatSlideToggleModule,
	MatProgressBarModule,
	MatSliderModule,
	MatInputModule,
	MatSelectModule
];

@NgModule({
	declarations: [],
	imports: materialModules,
	exports: materialModules
})
export class AngularMaterialModule { }
