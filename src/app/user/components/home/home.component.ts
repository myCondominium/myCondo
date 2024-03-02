import { Component } from '@angular/core';
import { BBoardService } from '../../../shared/services/bboard.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Homeservice } from '../../services/home.service';
import { AuthService } from 'src/app/shared/services/auth.service';


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
  fieldNames: any[] | undefined;
  userId = localStorage.getItem('userId') || '';
  userEmail = localStorage.getItem('userEmail') || '';
  isDictate = false;
  enableDictate: any;
  startDictate: any;
  endDictate: any;
  condoName: any;
  lastLogin: any;
  newBulletin = 0;



  constructor(
    private bboardService: BBoardService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private homeservice: Homeservice,
    private auth: AuthService

  ) {
    this.getLoginDates();
    this.getCondoName();
    this.getBbData();
    this.getMetersData();
    this.getDateValues();
    this.checkEnableDictate();

  }

  async checkEnableDictate() {
    await this.getMeterDate(this.userId);
    this.isDictate = this.isDictateThisMonth();
    if (!this.isDictate && (this.startDictate <= this.currentDay && this.endDictate >= this.currentDay)) {
      this.enableDictate = true;
    } else {
      this.enableDictate = false;
    }
  }

  getBbData() {
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

  isEntryNew(creationTimestamp: any) {
    return this.lastLogin <= creationTimestamp;
  }

  getMetersData() {
    this.homeservice.getMetersData().subscribe({
      next: (data) => {
        this.metersData = data;
        this.startDictate = this.metersData.meterData.start;
        this.endDictate = this.metersData.meterData.end;
        console.log('Sikeres adatlekérés:', this.metersData.meterData);
      },
      error: (error) => {
        console.error('Hiba történt a metersData lekérdezésekor:', error);
      }
    });
  }

  async getMeterDate(userId: string) {
    try {
      this.fieldNames = await this.homeservice.getMeterDate(userId);
      console.log('Field nevek:', this.fieldNames);
    } catch (error) {
      console.error('Hiba:', error);
    }
  }

  sanitizeHTML(html: string): SafeHtml {
    const sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    return sanitizedHtml;
  }


  formatTimestamp(timestamp: any): string {

    return this.datePipe.transform(timestamp.toDate(), 'yyyy MM-dd HH:mm') || '';
  }


  getDateValues() {
    const date = this.datePipe.transform(new Date(), 'yyyy_M-d') || '';
    const parts = date.split("-");
    this.currentYearAndMonth = parts[0];
    this.currentDay = parts[1];
  }

  isDictateThisMonth() {
    if (this.fieldNames?.includes(this.currentYearAndMonth)) {
      return true;
    } else {
      return false;
    }
  }

  async getCondoName() {
    try {
      this.condoName = await this.homeservice.getCondoName();
    } catch (error) {
      console.error('Hiba a név lekérdezésekor:', error);
    }
  }

  async getLoginDates() {
    try {
      this.lastLogin = await this.homeservice.getLoginDates(this.userId);
    } catch (error) {
      console.error('Hiba az utolsó bejelentkezés lekérésekor:', error);
    }
  }

  logout() {
    this.auth.logout();
  }
}
