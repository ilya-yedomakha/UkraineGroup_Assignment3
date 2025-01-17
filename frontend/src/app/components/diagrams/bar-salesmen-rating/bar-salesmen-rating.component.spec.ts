import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarSalesmenRatingComponent } from './bar-salesmen-rating.component';

describe('BarSalesmenRatingComponent', () => {
  let component: BarSalesmenRatingComponent;
  let fixture: ComponentFixture<BarSalesmenRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarSalesmenRatingComponent]
    });
    fixture = TestBed.createComponent(BarSalesmenRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
