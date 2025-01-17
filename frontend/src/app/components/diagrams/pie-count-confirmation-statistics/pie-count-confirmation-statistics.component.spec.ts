import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieCountConfirmationStatisticsComponent } from './pie-count-confirmation-statistics.component';

describe('PieCountConfirmationStatisticsComponent', () => {
  let component: PieCountConfirmationStatisticsComponent;
  let fixture: ComponentFixture<PieCountConfirmationStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PieCountConfirmationStatisticsComponent]
    });
    fixture = TestBed.createComponent(PieCountConfirmationStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
