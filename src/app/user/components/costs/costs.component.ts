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

  constructor(private service: CostsService) {
    this.initMetersDatas();
  }

  async initMetersDatas(): Promise<void> {
    this.meterDatas = {
      start: await this.service.getMetersData('start'),
      end: await this.service.getMetersData('end'),
      commoncost: await this.service.getMetersData('commoncost'),
      heatingbase: await this.service.getMetersData('heatingbase'),
      heatingmulti: await this.service.getMetersData('heatingmulti'),
      waterheating: await this.service.getMetersData('waterheating')
    };
    this.createArray();
  }

  createArray() {
    this.datas = [
      { title: "Diktálás kezdete", value: "Minden hónap " + this.meterDatas.start.value + ". napja" },
      { title: "Diktálás vége", value: "Minden hónap " + this.meterDatas.end.value + ". napja" },
      { title: "Közös költség", value: this.meterDatas.commoncost.value + " Ft/m<sup>2</sup>" },
      { title: "Fűtés alapdíj", value: this.meterDatas.heatingbase.value + " Ft" },
      { title: "Fűtés egység szorzó", value: this.meterDatas.heatingmulti.value + " Ft" },
      { title: "Vízfelmelegítési díj", value: this.meterDatas.waterheating.value + " Ft/m<sup>3</sup>" }
    ];
  }
}
