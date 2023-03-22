import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-weather-small',
  templateUrl: './weather-small.component.html',
  styleUrls: ['./weather-small.component.scss']
})
export class WeatherSmallComponent {
  @Input() weather_data: any; //Inherited from the parent
  @Input() title: any; //Inherited from the parent
  displayedWeather: Map<string, string> = new Map();
  icnSource = 'https://openweathermap.org/img/wn/';
  isNight: boolean = false;
  places: string[] = ['Harku', 'Jõhvi', 'Kuressaare', 'Pärnu', 'Tartu', 'Türi'];
  selectedLocation: string = 'Tartu';
  selectedLocationWeather: Map<string, string> = new Map();
  currentIconBig: string = this.icnSource + '01d@2x.png';

  ngOnChanges() { //Need to use this instead of ngAfterInit for whatever reason
    this.setDisplayedWeather('day');
    this.currentIconBig = this.getWeatherIcon(this.displayedWeather, '@2x.png');
  }

  /**
   * Sets the displaed weather Map according to the day/night state
   * @param state 
   */
  setDisplayedWeather(state: string) {
    const keys = Object.keys(this.weather_data);

    keys.forEach(key => {
      if (key.includes(state)) {
        this.displayedWeather.set(key.slice(key.indexOf('_') + 1), this.weather_data[key]);
      }
    })
  }

  /**
   * Event handler for the day/night toggle
   * @param event 
   */
  toggleDayNight(event: any) {
    this.isNight = event.checked;

    if (this.isNight) {
      this.setDisplayedWeather('night');
  } else {
      this.setDisplayedWeather('day');
    }

    this.currentIconBig = this.getWeatherIcon(this.displayedWeather, '@2x.png');
  }

  /**
   * Reuturns the path to the correct icon based on the weather phenomenon
   * @param weather The Map containing the weather data
   * @returns The icon path as a String
   */
  getWeatherIcon(weather: Map<String, String>, size: string) {
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

  return this.icnSource + icon + (this.isNight ? 'n' : 'd') + size;

  }
}
