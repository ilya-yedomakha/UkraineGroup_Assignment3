import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSnackBarComponent } from './custom-snack-bar.component';

describe('CustomSnackBarComponent', () => {
  let component: CustomSnackBarComponent;
  let fixture: ComponentFixture<CustomSnackBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomSnackBarComponent]
    });
    fixture = TestBed.createComponent(CustomSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
