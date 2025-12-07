import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTrip } from './register-trip';

describe('RegisterTrip', () => {
  let component: RegisterTrip;
  let fixture: ComponentFixture<RegisterTrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterTrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterTrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
