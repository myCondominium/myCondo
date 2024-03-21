import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  measureRecStart: any;
  measureRecEnd: any;
  meterNumber: number = 2;
  commonCost: any;
  heatingBase: any;
  heatingMulti: any;
  waterHeating: any;
  subdeposit: any;

  condoDatas: any[] = [];
  title: any;
  data: any;

  constructor(private settingService: SettingsService) {
    this.checkIsCollectionExists();
    this.initBaseDatas();
    this.initCondoDatas();
  }

  //alapadatok lekérése
  async initBaseDatas() {
    const settingPromises = [
      this.settingService.getSettingDatas('start'),
      this.settingService.getSettingDatas('end'),
      this.settingService.getSettingDatas('meternumber'),
      this.settingService.getSettingDatas('commoncost'),
      this.settingService.getSettingDatas('heatingbase'),
      this.settingService.getSettingDatas('heatingmulti'),
      this.settingService.getSettingDatas('waterheating'),
      this.settingService.getSettingDatas('subdeposit')
    ];

    const [
      measureRecStart,
      measuseRecEnd,
      meterNumber,
      commonCost,
      heatingBase,
      heatingMulti,
      waterHeating,
      subdeposit
    ] = await Promise.all(settingPromises);

    this.measureRecStart = measureRecStart;
    this.measureRecEnd = measuseRecEnd;
    this.meterNumber = meterNumber;
    this.commonCost = commonCost;
    this.heatingBase = heatingBase;
    this.heatingMulti = heatingMulti;
    this.waterHeating = waterHeating;
    this.subdeposit = subdeposit
  }

  // diktálási dátumok mentése
  async saveRecDate() {
    const isValidValues = this.measureRecStart > this.measureRecEnd ||
      this.measureRecStart === '' ||
      this.measureRecEnd === '' ||
      this.measureRecStart < 1 ||
      this.measureRecEnd < 2;

    if (isValidValues) {
      alert("Hibás adatok!");
    } else {
      try {
        await this.settingService.saveSettingData('start', this.measureRecStart);
        await this.settingService.saveSettingData('end', this.measureRecEnd);
        console.log("Diktálási dátumok sikeresen mentve.");
      } catch (error) {
        console.error("Hiba történt a diktálási dátumok mentése során:", error);
        alert("Hiba történt a mentés során. Próbáld újra később!");
      }
    }
  }

  // vízórák számának mentése mentése
  async saveMeterNumber() {
    try {
      await this.settingService.saveSettingData('meternumber', this.meterNumber);
    } catch (error) {
      console.error("Hiba történt az órák számának mentése során:", error);
      alert("Hiba történt a mentés során. Próbáld újra később!");
    }
  }

  // költségadatok mentése
  async saveCostDatas() {
    const isValidValues = this.commonCost >= 0 &&
      this.heatingBase >= 0 &&
      this.heatingMulti >= 0 &&
      this.waterHeating >= 0;

    if (!isValidValues) {
      alert("Hibás adatok!");
    } else {
      try {
        await this.settingService.saveSettingData('commoncost', this.commonCost);
        await this.settingService.saveSettingData('heatingbase', this.heatingBase);
        await this.settingService.saveSettingData('heatingmulti', this.heatingMulti);
        await this.settingService.saveSettingData('waterheating', this.waterHeating);
        await this.settingService.saveSettingData('subdeposit', this.subdeposit);
        console.log("Diktálási dátumok sikeresen mentve.");
      } catch (error) {
        console.error("Hiba történt a diktálási dátumok mentése során:", error);
        alert("Hiba történt a mentés során. Próbáld újra később!");
      }
    }
  }

  // társasház adatainak kezelése
  async initCondoDatas() {
    await this.getCondoDatas();
    this.addNewRow();
  }

  // ellenőrizzük hogy létezik-e a társasház adatait tartalmazó kollekció, ha nem akkor létrehozzuk
  async checkIsCollectionExists() {
    const exists = await this.settingService.checkIsCollectionExists('condodatas');
    if (!exists) {
      console.log('A kollekció létezik.');
    } else {
      await this.settingService.createCollection();
    }
  }

  // lekérjük a társasház adatait
  async getCondoDatas(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.settingService.getCondoDatas().subscribe(data => {
        this.condoDatas = data;
        console.log('condoDatas:', this.condoDatas);
        resolve();
      }, error => {
        reject(error);
      });
    });
  }


  // új sor hozzáadása ha az utolsó elem nem üres
  addNewRow() {
    const lastItem = this.condoDatas[this.condoDatas.length - 1];
    if (lastItem.title.trim() !== '' || lastItem.data.trim() !== '') {
      const newId = '';
      this.condoDatas.push({ id: newId, title: '', data: '', editable: true });
    }
  }

  // új sor mentése vagy törlése ha nincs title érték
  async saveDataRow(id: any, title: any, data: any) {
    if (!title && id) {
      await this.settingService.deleteRow(id);
      await this.initCondoDatas();
      return;
    }
    if (id) {
      await this.settingService.updateRowData(id, title, data);
      await this.initCondoDatas();
    }
    if (!id && title) {
      await this.settingService.saveNewRow(title, data);
      await this.initCondoDatas();
    }

  }

}

