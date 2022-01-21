import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginOrchestratorComponent } from './login-orchestrator.component';

describe('LoginOrchestratorComponent', () => {
  let component: LoginOrchestratorComponent;
  let fixture: ComponentFixture<LoginOrchestratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginOrchestratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginOrchestratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
