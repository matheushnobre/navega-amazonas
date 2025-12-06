import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVessel } from './edit-vessel';

describe('EditVessel', () => {
  let component: EditVessel;
  let fixture: ComponentFixture<EditVessel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVessel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVessel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
