import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-weather-large',
  templateUrl: './weather-large.component.html',
  styleUrls: ['./weather-large.component.scss']
})
export class WeatherLargeComponent {
  @Input() weather_data: any;
  icnSource = 'https://openweathermap.org/img/wn/';
}
