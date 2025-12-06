import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEnterprise } from './register-enterprise';

describe('RegisterEnterprise', () => {
  let component: RegisterEnterprise;
  let fixture: ComponentFixture<RegisterEnterprise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterEnterprise]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterEnterprise);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
