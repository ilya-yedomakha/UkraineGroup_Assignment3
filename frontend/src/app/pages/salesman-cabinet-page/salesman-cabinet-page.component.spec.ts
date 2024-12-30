import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanCabinetPageComponent } from './salesman-cabinet-page.component';

describe('SalesmanCabinetPageComponent', () => {
  let component: SalesmanCabinetPageComponent;
  let fixture: ComponentFixture<SalesmanCabinetPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesmanCabinetPageComponent]
    });
    fixture = TestBed.createComponent(SalesmanCabinetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
