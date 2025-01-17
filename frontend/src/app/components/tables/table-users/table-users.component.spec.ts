import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableUsersComponent } from './table-users.component';

describe('TableUsersComponent', () => {
  let component: TableUsersComponent;
  let fixture: ComponentFixture<TableUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableUsersComponent]
    });
    fixture = TestBed.createComponent(TableUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
