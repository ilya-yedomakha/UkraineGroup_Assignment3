import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSalesmenComponent } from './table-salesmen.component';

describe('TableSalesmenComponent', () => {
  let component: TableSalesmenComponent;
  let fixture: ComponentFixture<TableSalesmenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableSalesmenComponent]
    });
    fixture = TestBed.createComponent(TableSalesmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
