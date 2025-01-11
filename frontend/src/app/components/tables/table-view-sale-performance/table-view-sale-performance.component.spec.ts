import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableViewSalePerformanceComponent } from './table-view-sale-performance.component';

describe('TableViewSalePerformanceComponent', () => {
  let component: TableViewSalePerformanceComponent;
  let fixture: ComponentFixture<TableViewSalePerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableViewSalePerformanceComponent]
    });
    fixture = TestBed.createComponent(TableViewSalePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
