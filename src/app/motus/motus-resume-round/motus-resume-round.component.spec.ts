import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotusResumeRoundComponent } from './motus-resume-round.component';

describe('ResumeRoundComponent', () => {
  let component: MotusResumeRoundComponent;
  let fixture: ComponentFixture<MotusResumeRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotusResumeRoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotusResumeRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
