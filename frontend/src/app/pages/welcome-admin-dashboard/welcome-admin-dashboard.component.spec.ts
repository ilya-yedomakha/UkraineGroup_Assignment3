import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeAdminDashboardComponent } from './welcome-admin-dashboard.component';

describe('WelcomeAdminDashboardComponent', () => {
  let component: WelcomeAdminDashboardComponent;
  let fixture: ComponentFixture<WelcomeAdminDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeAdminDashboardComponent]
    });
    fixture = TestBed.createComponent(WelcomeAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
