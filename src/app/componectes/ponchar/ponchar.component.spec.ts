import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoncharComponent } from './ponchar.component';

describe('PoncharComponent', () => {
  let component: PoncharComponent;
  let fixture: ComponentFixture<PoncharComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoncharComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoncharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
