import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherSmallComponent } from './weather-small.component';

describe('WeatherSmallComponent', () => {
  let component: WeatherSmallComponent;
  let fixture: ComponentFixture<WeatherSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeatherSmallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
