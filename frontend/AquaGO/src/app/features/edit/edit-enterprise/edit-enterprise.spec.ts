import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEnterprise } from './edit-enterprise';

describe('EditEnterprise', () => {
  let component: EditEnterprise;
  let fixture: ComponentFixture<EditEnterprise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEnterprise]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEnterprise);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
