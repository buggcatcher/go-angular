import { TestBed } from '@angular/core/testing';
import { About } from './about';

describe('About', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [About]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(About);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
