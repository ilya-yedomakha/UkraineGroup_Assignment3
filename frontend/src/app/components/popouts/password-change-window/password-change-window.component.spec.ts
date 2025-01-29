import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordChangeWindowComponent } from './password-change-window.component';

describe('PasswordChangeWindowComponent', () => {
  let component: PasswordChangeWindowComponent;
  let fixture: ComponentFixture<PasswordChangeWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordChangeWindowComponent]
    });
    fixture = TestBed.createComponent(PasswordChangeWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
