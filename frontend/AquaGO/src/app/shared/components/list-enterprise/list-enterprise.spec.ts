import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEnterprise } from './list-enterprise';

describe('ListEnterprise', () => {
  let component: ListEnterprise;
  let fixture: ComponentFixture<ListEnterprise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEnterprise]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEnterprise);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
