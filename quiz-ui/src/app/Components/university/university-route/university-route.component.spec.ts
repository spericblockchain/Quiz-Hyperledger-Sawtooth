import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityRouteComponent } from './university-route.component';

describe('UniversityRouteComponent', () => {
  let component: UniversityRouteComponent;
  let fixture: ComponentFixture<UniversityRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversityRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversityRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
