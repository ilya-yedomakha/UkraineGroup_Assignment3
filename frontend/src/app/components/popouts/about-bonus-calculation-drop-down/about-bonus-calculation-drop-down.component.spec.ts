import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBonusCalculationDropDownComponent } from './about-bonus-calculation-drop-down.component';

describe('AboutBonusCalculationDropDownComponent', () => {
  let component: AboutBonusCalculationDropDownComponent;
  let fixture: ComponentFixture<AboutBonusCalculationDropDownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutBonusCalculationDropDownComponent]
    });
    fixture = TestBed.createComponent(AboutBonusCalculationDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
