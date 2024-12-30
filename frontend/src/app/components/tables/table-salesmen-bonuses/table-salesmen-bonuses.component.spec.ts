import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSalesmenBonusesComponent } from './table-salesmen-bonuses.component';

describe('TableSalesmenBonusesComponent', () => {
  let component: TableSalesmenBonusesComponent;
  let fixture: ComponentFixture<TableSalesmenBonusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableSalesmenBonusesComponent]
    });
    fixture = TestBed.createComponent(TableSalesmenBonusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
