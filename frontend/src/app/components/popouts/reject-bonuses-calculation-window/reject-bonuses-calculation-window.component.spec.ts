import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectBonusesCalculationWindowComponent } from './reject-bonuses-calculation-window.component';

describe('RejectBonusesCalculationWindowComponent', () => {
  let component: RejectBonusesCalculationWindowComponent;
  let fixture: ComponentFixture<RejectBonusesCalculationWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RejectBonusesCalculationWindowComponent]
    });
    fixture = TestBed.createComponent(RejectBonusesCalculationWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
