import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableManageSocialPerformanceComponent } from './table-manage-social-performance.component';

describe('TableManageSocialPerformanceComponent', () => {
  let component: TableManageSocialPerformanceComponent;
  let fixture: ComponentFixture<TableManageSocialPerformanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableManageSocialPerformanceComponent]
    });
    fixture = TestBed.createComponent(TableManageSocialPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
