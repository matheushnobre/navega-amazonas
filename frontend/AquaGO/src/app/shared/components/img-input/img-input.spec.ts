import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgInput } from './img-input';

describe('ImgInput', () => {
  let component: ImgInput;
  let fixture: ComponentFixture<ImgInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
