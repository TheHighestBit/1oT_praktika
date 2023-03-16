import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-weather-large',
  templateUrl: './weather-large.component.html',
  styleUrls: ['./weather-large.component.scss']
})
export class WeatherLargeComponent implements OnChanges {
  @Input() weather_data: any; //Inherited from the parent
  displayedWeather: Map<string, string> = new Map();
  icnSource = 'https://openweathermap.org/img/wn/';
  isNight: boolean = false;
  places: string[] = ['Harku', 'Jõhvi', 'Kuressaare', 'Pärnu', 'Tartu', 'Türi'];
  selectedLocation: string = 'Tartu';
  selectedLocationWeather: Map<string, string> = new Map();
  
  ngOnChanges() { //Need to use this instead of ngAfterInit for whatever reason
    this.setDisplayedWeather('day');
    this.updateSelectedLocationWeather();
  }

  toggleDayNight(event: any) {
    this.isNight = event.checked;

    if (this.isNight) {
      this.setDisplayedWeather('night');
  } else {
      this.setDisplayedWeather('day');
    }

    this.updateSelectedLocationWeather();
  }

  setDisplayedWeather(state: string) {
    const keys = Object.keys(this.weather_data);

    keys.forEach(key => {
      if (key.includes(state)) {
        this.displayedWeather.set(key.slice(key.indexOf('_') + 1), this.weather_data[key]);
      }
    })
  }

  onLocationChange(event: any) {
    this.selectedLocation = event.value;
    this.updateSelectedLocationWeather();
  }

  updateSelectedLocationWeather() {
    this.displayedWeather.forEach((value, key) => {
      if (key.includes(this.selectedLocation)) {
        if (key.includes('temp')) {
          this.selectedLocationWeather.set('temp', value);
        } else {
          this.selectedLocationWeather.set('phenomenon', value);
        }
      }
    })
  }
}
