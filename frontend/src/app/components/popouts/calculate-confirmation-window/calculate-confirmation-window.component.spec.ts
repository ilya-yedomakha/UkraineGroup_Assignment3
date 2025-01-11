import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateConfirmationWindowComponent } from './calculate-confirmation-window.component';

describe('CalculateConfirmationWindowComponent', () => {
  let component: CalculateConfirmationWindowComponent;
  let fixture: ComponentFixture<CalculateConfirmationWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculateConfirmationWindowComponent]
    });
    fixture = TestBed.createComponent(CalculateConfirmationWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
