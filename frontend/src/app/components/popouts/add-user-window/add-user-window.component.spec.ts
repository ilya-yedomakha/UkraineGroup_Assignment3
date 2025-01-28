import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserWindowComponent } from './add-user-window.component';

describe('AddUserWindowComponent', () => {
  let component: AddUserWindowComponent;
  let fixture: ComponentFixture<AddUserWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUserWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
