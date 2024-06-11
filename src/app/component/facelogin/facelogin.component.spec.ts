import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceloginComponent } from './facelogin.component';

describe('FaceloginComponent', () => {
  let component: FaceloginComponent;
  let fixture: ComponentFixture<FaceloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceloginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
