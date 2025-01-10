import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbiddenPageComponent } from './forbidden-page.component';

describe('ForbidenPageComponent', () => {
  let component: ForbiddenPageComponent;
  let fixture: ComponentFixture<ForbiddenPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForbiddenPageComponent]
    });
    fixture = TestBed.createComponent(ForbiddenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
