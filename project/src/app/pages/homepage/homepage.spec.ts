import { TestBed } from '@angular/core/testing';
import { Homepage } from './homepage';

describe('Homepage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homepage]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Homepage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
