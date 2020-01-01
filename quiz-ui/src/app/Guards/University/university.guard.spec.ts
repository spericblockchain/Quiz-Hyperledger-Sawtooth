import { TestBed, async, inject } from '@angular/core/testing';

import { UniversityGuard } from './university.guard';

describe('UniversityGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UniversityGuard]
    });
  });

  it('should ...', inject([UniversityGuard], (guard: UniversityGuard) => {
    expect(guard).toBeTruthy();
  }));
});
