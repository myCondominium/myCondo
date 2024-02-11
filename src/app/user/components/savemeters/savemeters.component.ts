import { Component } from '@angular/core';
import { SavemetersService } from '../../services/savemeters.service';
import { DatePipe } from '@angular/common';
import { MetersService } from 'src/app/admin/services/meters.service';


@Component({
  selector: 'app-savemeters',
  templateUrl: './savemeters.component.html',
  styleUrls: ['./savemeters.component.css']
})
export class SavemetersComponent {
  userId = localStorage.getItem('userId') || '';
  metersData: any;
  currentDay: any;
  currentYearAndMonth: any;
  startDictate: any;
  endDictate: any;
  meterNum: any;
  fieldNames: any[] | undefined;
  isDictate = false;
  enableDictate: any;

  cold1: any;
  hot1: any;
  cold2: any;
  hot2: any;
  heat: any;
  errorMessage: any;
  message: any;




  constructor(
    private service: SavemetersService,
    private datePipe: DatePipe,
    private meterService: MetersService
  ) {
    this.getMetersData();
    this.getDateValues();
    this.checkEnableDictate();
  }

  getMetersData() {
    this.service.getMetersData().subscribe({
      next: (data) => {
        this.metersData = data;
        this.startDictate = this.metersData.meterData.start;
        this.endDictate = this.metersData.meterData.end;
        this.meterNum = this.metersData.meterData.meterNumber;
        console.log('Sikeres adatlekérés:', this.metersData.meterData);
      },
      error: (error) => {
        console.error('Hiba történt a metersData lekérdezésekor:', error);
      }
    });
  }

  getDateValues() {
    const date = this.datePipe.transform(new Date(), 'yyyy_M-d') || '';
    const parts = date.split("-");
    this.currentYearAndMonth = parts[0];
    this.currentDay = parts[1];
  }

  async getMeterDate(userId: string) {
    try {
      this.fieldNames = await this.service.getMeterDate(userId);
      console.log('Field nevek:', this.fieldNames);
    } catch (error) {
      console.error('Hiba:', error);
    }
  }

  async checkEnableDictate() {
    await this.getMeterDate(this.userId);
    this.isDictate = this.isDictateThisMonth();
    if (this.isDictate && (this.startDictate <= this.currentDay && this.endDictate >= this.currentDay)) {
      this.enableDictate = true;
    } else {
      this.enableDictate = false;
    }
  }

  isDictateThisMonth() {
    if (this.fieldNames?.includes(this.currentYearAndMonth)) {
      return false;
    } else {
      return true;
    }
  }

  save() {
    if (this.checkInputValues()) {
      const meterKey = `${new Date().getFullYear()}_${new Date().getMonth() + 1}`;
      const meterData = {
        [meterKey]: {
          meterColdOne: this.cold1,
          meterColdTwo: this.cold2 !== undefined ? this.cold2 : 0,
          meterHotOne: this.hot1,
          meterHotTwo: this.hot2 !== undefined ? this.hot2 : 0,
          amountOfHeat: this.heat !== undefined ? this.heat : 0
        }
      }
      console.log(meterData);
      this.meterService.saveMeter(this.userId, meterData);
      if (this.isDictateThisMonth()) {
        this.message = "Az óraállások mentése sikeres.";
        this.enableDictate = false;
      } else {
        this.message = "Az óraállások mentése nem sikerült.";
      }
    } else {
      this.errorMessage = true;
    }
  }

  checkInputValues() {
    if (this.meterNum == 2 && (this.cold1 == undefined || this.hot1 == undefined)) return false;
    if (this.meterNum == 4 && (this.cold1 == undefined || this.hot1 == undefined ||
      this.cold2 == undefined || this.hot2 == undefined)) { return false; }

    return true;
  }
}