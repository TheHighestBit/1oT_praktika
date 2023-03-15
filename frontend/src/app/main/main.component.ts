import { Component } from '@angular/core';
import { DataService } from 'src/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  today: any = {};
  tomorrow: any = {};
  day_2: any = {};
  day_3: any = {};

  constructor(
    private dataService : DataService
  ) { }

  ngOnInit() {
    this.dataService.getData().subscribe(
      (data) => {
        const keys = Object.keys(data).sort();
        console.log(data)
        
        this.today = data[keys[0]];
        this.tomorrow = data[keys[1]];
        this.day_2 = data[keys[2]];
        this.day_3 = data[keys[3]];
      }
    )
    }
}
