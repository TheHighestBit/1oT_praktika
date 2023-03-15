import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherLargeComponent } from './weather-large.component';

describe('WeatherLargeComponent', () => {
  let component: WeatherLargeComponent;
  let fixture: ComponentFixture<WeatherLargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeatherLargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
