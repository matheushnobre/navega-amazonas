import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDisplayComponent } from './image-display-component';

describe('ImageDisplayComponent', () => {
  let component: ImageDisplayComponent;
  let fixture: ComponentFixture<ImageDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageDisplayComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
