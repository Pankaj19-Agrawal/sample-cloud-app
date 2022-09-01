import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayDocumentComponent } from './display-document.component';

describe('DisplayDocumentComponent', () => {
  let component: DisplayDocumentComponent;
  let fixture: ComponentFixture<DisplayDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
