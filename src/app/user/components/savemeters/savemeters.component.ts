import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { sharedService } from 'src/app/shared/services/shared.service';

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
  meterDates: any[] | undefined;


  cold1: any;
  hot1: any;
  cold2: any;
  hot2: any;
  heat: any;
  errorMessage: any;
  message: any;




  constructor(
    private sharedService: sharedService,
    private datePipe: DatePipe
  ) {
    this.getDateValues();
    this.initMetersData();
  }

  // diktálási időpont kezdete és vége
  async initMetersData() {
    const sd = await this.sharedService.getMetersData('start');
    this.startDictate = sd.value;
    const ed = await this.sharedService.getMetersData('end');
    this.endDictate = ed.value;
    const mnum = await this.sharedService.getMetersData('meternumber')
    this.meterNum = mnum.value;
    this.checkEnableDictate();
  }

  // az aktuális dátum yyyy-m és d formátumra bontása
  getDateValues() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM_d') || '';
    const parts = date.split("_");
    this.currentYearAndMonth = parts[0];
    this.currentDay = parts[1];
  }


  // megvizsgáljuk hogy lehet-e diktálni
  async checkEnableDictate() {
    const isD = await this.isDictateThisMonth();
    this.isDictate = isD;
    if (!this.isDictate && (this.startDictate <= this.currentDay && this.endDictate >= this.currentDay)) {
      this.enableDictate = true;
    } else {
      this.enableDictate = false;
    }
  }

  // összehasonlítjuk a jelenlegi évet-hónapot, ha nincs a listában akkor lehet diktálni
  async isDictateThisMonth() {
    const meterDates = await this.sharedService.getMeterDates(this.userId).toPromise();
    this.meterDates = meterDates?.map(item => item.key);
    if (this.meterDates?.includes(this.currentYearAndMonth)) {
      return true;
    } else {
      return false;
    }
  }

  async save() {
    if (this.checkInputValues()) {
      const meterKey = this.getMeterDate();
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
      this.sharedService.saveMeter(this.userId, meterData);
      if (await this.isDictateThisMonth()) {
        this.message = "Az óraállások mentése sikeres.";
        this.enableDictate = false;
      } else {
        this.message = "Az óraállások mentése nem sikerült.";
      }
    } else {
      this.errorMessage = true;
    }
  }

  // az év és hónap formázása /pl.: 2024-03/
  getMeterDate() {
    return this.datePipe.transform(new Date(), 'yyyy-MM')!;
  }

  checkInputValues() {
    if (this.meterNum == 2 && (this.cold1 == undefined || this.hot1 == undefined)) return false;
    if (this.meterNum == 4 && (this.cold1 == undefined || this.hot1 == undefined ||
      this.cold2 == undefined || this.hot2 == undefined)) { return false; }

    return true;
  }
}