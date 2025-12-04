import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterVessel } from './register-vessel';

describe('RegisterVessel', () => {
  let component: RegisterVessel;
  let fixture: ComponentFixture<RegisterVessel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterVessel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterVessel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
