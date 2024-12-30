import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSalesmanCabinetComponent } from './table-salesman-cabinet.component';

describe('TableSalesmanCabinetComponent', () => {
  let component: TableSalesmanCabinetComponent;
  let fixture: ComponentFixture<TableSalesmanCabinetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableSalesmanCabinetComponent]
    });
    fixture = TestBed.createComponent(TableSalesmanCabinetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
