import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSocialPerformanceWindowComponent } from './add-social-performance-window.component';

describe('AddSocialPerformanceWindowComponent', () => {
  let component: AddSocialPerformanceWindowComponent;
  let fixture: ComponentFixture<AddSocialPerformanceWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSocialPerformanceWindowComponent]
    });
    fixture = TestBed.createComponent(AddSocialPerformanceWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
