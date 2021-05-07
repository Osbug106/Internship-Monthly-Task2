import { TestBed } from '@angular/core/testing';

import { FetchCategoriesService } from './fetch-categories.service';

describe('FetchCategoriesService', () => {
  let service: FetchCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
