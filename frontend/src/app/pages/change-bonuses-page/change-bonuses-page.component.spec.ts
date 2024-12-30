import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeBonusesPageComponent } from './change-bonuses-page.component';

describe('ChangeBonusesPageComponent', () => {
  let component: ChangeBonusesPageComponent;
  let fixture: ComponentFixture<ChangeBonusesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeBonusesPageComponent]
    });
    fixture = TestBed.createComponent(ChangeBonusesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
