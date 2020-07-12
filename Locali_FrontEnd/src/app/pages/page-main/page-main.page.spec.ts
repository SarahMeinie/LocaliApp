import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMainPage } from './page-main.page';

describe('PageMainPage', () => {
  let component: PageMainPage;
  let fixture: ComponentFixture<PageMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageMainPage ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PageMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
