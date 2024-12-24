import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSalesmanBonusesComponent } from './table-salesman-bonuses.component';

describe('TableSalesmanBonusesComponent', () => {
  let component: TableSalesmanBonusesComponent;
  let fixture: ComponentFixture<TableSalesmanBonusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableSalesmanBonusesComponent]
    });
    fixture = TestBed.createComponent(TableSalesmanBonusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
