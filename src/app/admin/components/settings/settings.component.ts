import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

interface MeterData {
  meterData: {
    start: number;
    end: number;
    commonCost: number;
    waterHeating: number;
    heatingBase: number;
    heatingMulti: number;
    meterNumber: number;
  };
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  condoData: any;
  field: any;
  selectedMeterNumber: number = 2;
  metersStart: any;
  metersEnd: any;
  meterData: any;
  mCommonCost: any;
  mWaterHeating: any;
  mHeatingBase: any;
  mHeatingMulti: any;

  constructor(private settingService: SettingsService) {
    this.condoData = this.getCondoDataAndAddField();
    this.getMetersData();
  }

  // információs mezők metódusai
  getCondoDataAndAddField() {
    this.settingService.getCondoDatasAndAddField().subscribe(
      (condoData: any) => {
        this.condoData = condoData;
        this.addField();
        this.getMetersData();
      },
      (error: any) => {
        console.error("Error fetching condo data:", error);
      }
    );
    return this.condoData;
  }

  createCollectionWithField() {
    this.settingService.createCollectionWithField();
    this.addField();
  }

  saveDataRow(userId: any, title: any, data: any, editable: any) {
    this.settingService.saveDataRow(userId, title, data, editable);
    this.getCondoDataAndAddField();
    this.addField();
  }

  addField() {
    const lastRow = this.condoData[this.condoData.length - 1];

    if (lastRow && lastRow.fields.every((field: { title: string; data: string; }) => field.title.trim() === '' && field.data.trim() === '')) {
      console.log('Az utolsó sor üres, nem adunk hozzá új sort.');
    } else {
      const newField1 = { title: '', data: '', editable: true }; // Létrehozzuk az editable tulajdonságot
      this.condoData.push({ fields: [newField1] });
    }
  }

  async updateFirestoreDocument(dataId: string, title: string, data: string, editable: boolean) {
    await this.settingService.updateFirestoreDocument(dataId, title, data, editable);
    this.getCondoDataAndAddField();
  }

  // diktálási időszak metódusai
  saveDate() {
    if (this.metersStart > this.metersEnd || this.metersStart === ''
      || this.metersEnd === '' || this.metersStart < 1 || this.metersEnd < 2) {
      alert("Hibás adatok!");
    } else {
      const data = {
        meterData: {
          start: this.metersStart,
          end: this.metersEnd,
        },
      };
      this.settingService.saveDate(data);
      this.getMetersData();
    }
  }

  getMetersData() {   //service
    this.settingService.getMetersData().subscribe((data) => {
      this.meterData = data;
      if (data) {
        this.metersStart = data.meterData.start;
        this.metersEnd = data.meterData.end;
        this.mCommonCost = data.meterData.commonCost;
        this.mWaterHeating = data.meterData.waterHeating;
        this.mHeatingBase = data.meterData.heatingBase;
        this.mHeatingMulti = data.meterData.heatingMulti;
        this.selectedMeterNumber = data.meterData.meterNumber;
      } else {
        console.error('Nincs adat');
      }
    });
  }

  // költségadatok mentése
  saveCost() {
    if (this.mCommonCost < 0 ||
      this.mWaterHeating < 0 ||
      this.mHeatingBase < 0 ||
      this.mHeatingMulti < 0) {
      alert("Hibás adatok!");
      this.settingService.getMetersData();
    } else {
      const data = {
        meterData: {
          commonCost: this.mCommonCost !== undefined ? this.mCommonCost : 0,
          waterHeating: this.mWaterHeating !== undefined ? this.mWaterHeating : 0,
          heatingBase: this.mHeatingBase !== undefined ? this.mHeatingBase : 0,
          heatingMulti: this.mHeatingMulti !== undefined ? this.mHeatingMulti : 0
        }
      };
      this.settingService.saveCost(data);
      this.settingService.getMetersData();
    }
    this.settingService.getMetersData();
  }

  // vízórák számának mentése
  saveMeterNumber() {
    const data = {
      meterData: {
        meterNumber: this.selectedMeterNumber
      },
    };
    this.settingService.saveMeterNumber(data);
    this.settingService.getMetersData();
  }
}

