import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotusRoundComponent } from './motus-round.component';

describe('MotusRoundComponent', () => {
  let component: MotusRoundComponent;
  let fixture: ComponentFixture<MotusRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotusRoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotusRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
