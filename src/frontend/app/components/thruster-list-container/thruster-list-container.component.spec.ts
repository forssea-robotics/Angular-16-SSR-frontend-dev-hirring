import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrusterListContainerComponent } from './thruster-list-container.component';

describe('ThrusterListContainerComponent', () => {
  let component: ThrusterListContainerComponent;
  let fixture: ComponentFixture<ThrusterListContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThrusterListContainerComponent]
    });
    fixture = TestBed.createComponent(ThrusterListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
