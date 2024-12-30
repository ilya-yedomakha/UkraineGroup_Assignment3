import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusesPageComponent } from './bonuses-page.component';

describe('BonusesPageComponent', () => {
  let component: BonusesPageComponent;
  let fixture: ComponentFixture<BonusesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BonusesPageComponent]
    });
    fixture = TestBed.createComponent(BonusesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
