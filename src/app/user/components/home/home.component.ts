import { Component } from '@angular/core';
import { BBoardService } from '../../../shared/services/bboard.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Homeservice } from '../../services/home.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UploadfileService } from 'src/app/admin/services/uploadfile.service';
import { sharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  bulletinBoardData: any[] | undefined;
  metersData: any;
  currentDay: any;
  currentYearAndMonth: any;
  meterDates: any[] | undefined;
  userId = localStorage.getItem('userId') || '';
  userEmail = localStorage.getItem('userEmail') || '';
  isDictate = false;
  enableDictate: any;
  startDictate: any;
  endDictate: any;
  condoName: any;
  lastLogin: any;
  newBulletin = 0;
  uploadedFiles: any;
  newFiles = 0;


  constructor(
    private bboardService: BBoardService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private homeservice: Homeservice,
    private auth: AuthService,
    private file: UploadfileService,
    private SharedService: sharedService

  ) {
    this.getLoginDates();
    this.getCondoName();
    this.getBbData();
    this.initMetersData();
    this.getDateValues();
    this.getFiles();

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
    const meterDates = await this.SharedService.getMeterDates(this.userId).toPromise();
    this.meterDates = meterDates?.map(item => item.key);
    if (this.meterDates && this.meterDates.includes(this.currentYearAndMonth)) {
      return true;
    } else {
      return false;
    }
  }


  // utolsó bejelentkezés lekérése
  async getLoginDates() {
    try {
      this.lastLogin = await this.homeservice.getLoginDates(this.userId);
    } catch (error) {
      console.error('Hiba a bejelentkezési adatok lekérésekor:', error);
    }
  }

  // faliújság lekérése
  async getBbData() {
    this.bboardService.getAllBulletinBoardData().subscribe((data: any[]) => {
      this.bulletinBoardData = data;

      this.bulletinBoardData.forEach((item: any) => {
        const timestamp = item.timestamp;
        if (this.isEntryNew(timestamp)) {
          this.newBulletin++;
        }
      });
    });
  }

  // fájlok lekérése
  getFiles() {
    this.file.getUploadedFiles().subscribe((uFiles: any) => {
      this.uploadedFiles = uFiles;

      this.uploadedFiles.forEach((item: any) => {
        const timestamp = item.timestamp;
        if (this.isFileNewer(timestamp)) {
          this.newFiles++;
        }
      })
    });
  }

  isFileNewer(timestamp: any) {
    return this.lastLogin <= timestamp;
  }

  // megvizsgáljuk hogy a faliújság létrehozása később volt-e mint az utolsó bejelentkezés
  isEntryNew(creationTimestamp: any) {
    const seconds = creationTimestamp.seconds;
    const nanoSeconds = creationTimestamp.nanoseconds;
    const created = (seconds * 1000) + Math.floor(nanoSeconds / 1000000);
    return this.lastLogin <= created;
  }

  // diktálási időpont kezdete és vége
  async initMetersData() {
    const sd = await this.SharedService.getMetersData('start');
    this.startDictate = sd.value;
    const ed = await this.SharedService.getMetersData('end');
    this.endDictate = ed.value;
    this.checkEnableDictate();
  }

  sanitizeHTML(html: string): SafeHtml {
    const sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    return sanitizedHtml;
  }


  formatTimestamp(timestamp: any): string {
    return this.datePipe.transform(timestamp.toDate(), 'yyyy MM-dd HH:mm') || '';
  }

  // az aktuális dátum yyyy-m és d formátumra bontása
  getDateValues() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM_d') || '';
    const parts = date.split("_");
    this.currentYearAndMonth = parts[0];
    this.currentDay = parts[1];
  }

  // társasház nevének lekérése
  async getCondoName() {
    try {
      this.condoName = await this.SharedService.getCondoName();
    } catch (error) {
      console.error('Hiba a név lekérdezésekor:', error);
    }
  }

  logout() {
    this.auth.logout();
  }
}
