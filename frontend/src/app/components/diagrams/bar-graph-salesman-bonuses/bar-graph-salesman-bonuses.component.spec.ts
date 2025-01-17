import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarGraphSalesmanBonusesComponent } from './bar-graph-salesman-bonuses.component';

describe('BarGraphSalesmanBonusesComponent', () => {
  let component: BarGraphSalesmanBonusesComponent;
  let fixture: ComponentFixture<BarGraphSalesmanBonusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarGraphSalesmanBonusesComponent]
    });
    fixture = TestBed.createComponent(BarGraphSalesmanBonusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
