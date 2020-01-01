import { TestBed, async, inject } from '@angular/core/testing';

import { ProfessorGuard } from './professor.guard';

describe('ProfessorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfessorGuard]
    });
  });

  it('should ...', inject([ProfessorGuard], (guard: ProfessorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
