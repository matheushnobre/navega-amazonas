import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripSegmentCard } from './trip-segment-card';

describe('TripSegmentCard', () => {
  let component: TripSegmentCard;
  let fixture: ComponentFixture<TripSegmentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripSegmentCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripSegmentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
