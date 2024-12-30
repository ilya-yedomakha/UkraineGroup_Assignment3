import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSocialBonusesComponent } from './table-social-bonuses.component';

describe('TableSocialBonusesComponent', () => {
  let component: TableSocialBonusesComponent;
  let fixture: ComponentFixture<TableSocialBonusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableSocialBonusesComponent]
    });
    fixture = TestBed.createComponent(TableSocialBonusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
