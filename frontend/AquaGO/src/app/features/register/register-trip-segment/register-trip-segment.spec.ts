import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTripSegment } from './register-trip-segment';

describe('RegisterTripSegment', () => {
  let component: RegisterTripSegment;
  let fixture: ComponentFixture<RegisterTripSegment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterTripSegment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterTripSegment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
