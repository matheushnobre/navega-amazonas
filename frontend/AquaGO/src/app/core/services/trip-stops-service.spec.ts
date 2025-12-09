import { TestBed } from '@angular/core/testing';

import { TripStopsService } from './trip-stops-service';

describe('TripStopsService', () => {
  let service: TripStopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripStopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
