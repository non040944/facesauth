import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceregisterComponent } from './faceregister.component';

describe('FaceregisterComponent', () => {
  let component: FaceregisterComponent;
  let fixture: ComponentFixture<FaceregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
