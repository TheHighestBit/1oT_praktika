import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-weather-large',
  templateUrl: './weather-large.component.html',
  styleUrls: ['./weather-large.component.scss']
})
export class WeatherLargeComponent implements OnChanges {
  @Input() weather_data: any; //Inherited from the parent
  @Input() title: any;
  displayedWeather: Map<string, string> = new Map();
  icnSource = 'https://openweathermap.org/img/wn/';
  isNight: boolean = false;
  places: string[] = ['Harku', 'Jõhvi', 'Kuressaare', 'Pärnu', 'Tartu', 'Türi'];
  selectedLocation: string = 'Tartu';
  selectedLocationWeather: Map<string, string> = new Map();
  currentIconBig: string = this.icnSource + '01d@2x.png'; //Icon for the overall weather
  currentIconSmall: string = this.icnSource + '01d@2x.png'; //Icon for the selected location
  
  ngOnChanges() { //Need to use this instead of ngAfterInit for whatever reason
    this.setDisplayedWeather('day');
    this.updateSelectedLocationWeather();
    this.currentIconBig = this.getWeatherIcon(this.displayedWeather);
    this.currentIconSmall = this.getWeatherIcon(this.selectedLocationWeather);
  }

  toggleDayNight(event: any) {
    this.isNight = event.checked;

    if (this.isNight) {
      this.setDisplayedWeather('night');
  } else {
      this.setDisplayedWeather('day');
    }

    this.updateSelectedLocationWeather();
    this.currentIconBig = this.getWeatherIcon(this.displayedWeather);
  }

  setDisplayedWeather(state: string) {
    const keys = Object.keys(this.weather_data);

    keys.forEach(key => {
      if (key.includes(state)) {
        this.displayedWeather.set(key.slice(key.indexOf('_') + 1), this.weather_data[key]);
      }
    })

    if (this.displayedWeather.get('sea') === '') { //The sea weather for tomorrow is usually not available
      this.displayedWeather.set('sea', 'Sea weather not available!');
    }
  }

  onLocationChange(event: any) {
    this.selectedLocation = event.value;
    this.updateSelectedLocationWeather();
    this.currentIconSmall = this.getWeatherIcon(this.selectedLocationWeather);
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

  /**
   * Reuturns the path to the correct icon based on the weather phenomenon
   * @param weather The Map containing the weather data
   * @param size 
   * @returns 
   */
  getWeatherIcon(weather: Map<String, String>) {
    let phenomenon = weather.get('phenomenon');
    let icon = '';

    //All possible weather phenomena as per https://www.ilmateenistus.ee/teenused/ilmainfo/eesti-prognoos-xml/
    switch (phenomenon) {
    case "Clear":
      icon = '01';
      break;
    case "Few clouds":
    case "Variable clouds":
      icon = '02';
      break;
    case "Cloudy with clear spells":
    case "Cloudy":
      icon = '02';
      break;
    case "Light snow shower":
    case "Moderate snow shower":
    case "Heavy snow shower":
    case "Light sleet":
    case "Moderate sleet":
    case "Light snowfall":
    case "Moderate snowfall":
    case "Heavy snowfall":
    case "Snowstorm":
    case "Drifting snow":
    case "Hail":
      icon = '13';
      break;
    case "Light shower":
    case "Light rain":
      icon = '09'
      break;
    case "Moderate shower":
    case "Heavy shower":
    case "Moderate rain":
    case "Heavy rain":
      icon = '10';
      break;
    case "Risk of glaze":
      icon = '13'
      break;
    case "Mist":
    case "Fog":
      icon = '50';
      break;
    case "Thunder":
    case "Thunderstorm":
      icon = '11';
      break;
  }

  return this.icnSource + icon + (this.isNight ? 'n' : 'd') + '@2x.png';

  }
}
