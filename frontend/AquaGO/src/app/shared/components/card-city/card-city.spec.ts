import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCity } from './card-city';

describe('CardCity', () => {
  let component: CardCity;
  let fixture: ComponentFixture<CardCity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
