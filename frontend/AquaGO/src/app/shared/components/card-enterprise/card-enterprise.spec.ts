import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEnterprise } from './card-enterprise';

describe('CardEnterprise', () => {
  let component: CardEnterprise;
  let fixture: ComponentFixture<CardEnterprise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEnterprise]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEnterprise);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
