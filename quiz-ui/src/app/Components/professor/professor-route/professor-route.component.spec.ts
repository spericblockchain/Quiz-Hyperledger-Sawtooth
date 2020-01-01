import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorRouteComponent } from './professor-route.component';

describe('ProfessorRouteComponent', () => {
  let component: ProfessorRouteComponent;
  let fixture: ComponentFixture<ProfessorRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessorRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessorRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
