import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCabinetPageComponent } from './admin-cabinet-page.component';

describe('AdminCabinetPageComponent', () => {
  let component: AdminCabinetPageComponent;
  let fixture: ComponentFixture<AdminCabinetPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCabinetPageComponent]
    });
    fixture = TestBed.createComponent(AdminCabinetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
