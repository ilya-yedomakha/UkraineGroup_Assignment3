import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOrdersBonusesComponent } from './table-orders-bonuses.component';

describe('TableOrdersBonusesComponent', () => {
  let component: TableOrdersBonusesComponent;
  let fixture: ComponentFixture<TableOrdersBonusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableOrdersBonusesComponent]
    });
    fixture = TestBed.createComponent(TableOrdersBonusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
