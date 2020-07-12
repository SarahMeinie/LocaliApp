import { TestBed } from '@angular/core/testing';

import { MBService } from './mapbox.service';

describe('MBService', () => {
  let service: MBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
