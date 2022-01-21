import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotusMotInputComponent } from './motus-mot-input.component';

describe('MotusMotInputComponent', () => {
  let component: MotusMotInputComponent;
  let fixture: ComponentFixture<MotusMotInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotusMotInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotusMotInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
