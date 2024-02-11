import { Component } from '@angular/core';
import { CostsService } from '../../services/costs.service';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.css']
})
export class CostsComponent {
  meterDatas: any = {};
  datas: any = [];

  constructor(
    private service: CostsService) {
    this.getMeterData();
  }

  getMeterData() {
    this.service.getMeterData().subscribe({
      next: (data) => {
        this.meterDatas = data;
        this.createArray(this.meterDatas);
        console.log('Sikeres adatlekérés:', this.meterDatas);
      },
      error: (error) => {
        console.error('Hiba történt a userData lekérdezésekor:', error);
      }
    });
  }

  createArray(meterDatas: any) {
    this.datas = [
      { title: "Diktálás kezdete", value: "Minden hónap " + meterDatas.meterData.start + ". napja" },
      { title: "Diktálás vége", value: "Minden hónap " + meterDatas.meterData.end + ". napja" },
      { title: "Közös költség", value: meterDatas.meterData.commonCost + " Ft/m<sup>2</sup>" },
      { title: "Fűtés alapdíj", value: meterDatas.meterData.heatingBase + " Ft" },
      { title: "Fűtés egység szorzó", value: meterDatas.meterData.heatingMulti + " Ft" },
      { title: "Vízfelmelegítési díj", value: meterDatas.meterData.waterHeating + " Ft/m<sup>3</sup>" }
    ]
  }
}
