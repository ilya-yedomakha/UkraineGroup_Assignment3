import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSotialPerformanceWindowComponent } from './add-sotial-performance-window.component';

describe('AddSotialPerformanceWindowComponent', () => {
  let component: AddSotialPerformanceWindowComponent;
  let fixture: ComponentFixture<AddSotialPerformanceWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSotialPerformanceWindowComponent]
    });
    fixture = TestBed.createComponent(AddSotialPerformanceWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
