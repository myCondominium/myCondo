import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetersService } from '../../services/meters.service';


@Component({
  selector: 'app-meters',
  templateUrl: './meters.component.html',
  styleUrls: ['./meters.component.css']
})
export class MetersComponent {
  error: any;

  meterusers: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 10;
  meterNumber: any;
  yearAndMonth: any;
  data: any;
  userName: any;
  expandedUserId: number | null = null;
  meters: any;
  users: any;
  allData: any[] = [];
  meterDate: any;

  constructor(
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private meterService: MetersService) {
    this.initializeData();
  }

  initializeData() {
    const meterDate = this.getMeterDate();
    this.meterService.getAllData(meterDate).subscribe({
      next: (data: any[]) => {
        this.meterNumber = this.getMeterNum();
        this.meterusers = data;
        this.error = data;
        this.sortUsersByName();
        this.filterUsers();
        this.yearAndMonth = this.getYearAndMonth();
        this.meterDate = this.getMeterDate();
        console.log('kapott adatok:', this.meterusers);
      },
      error: (error) => {
        console.error('Hiba az adatok lekérésekor:', error);
      }
    });
  }

  async getMeterNum() {
    try {
      const meterNum = await this.meterService.getMeterNumber();
      this.meterNumber = meterNum.mnum;
    } catch (error) {
      console.error('Hiba történt a mérőszám lekérésekor:', error);
    }
  }

  async openModal(content: any, userId: string, userName: string) {
    try {
      const meterData = await this.meterService.getMeterData(userId).toPromise();

      if (meterData) {
        const sortedMeterData = this.sortMeterData(meterData);
        this.data = sortedMeterData;
        this.userName = userName;
        this.modalService.open(content, { centered: true });
      } else {
        console.error('A lekért adatok üresek vagy undefined.');
      }
    } catch (error) {
      console.error('Hiba történt az adatok lekérése közben:', error);
    }
  }

  sortMeterData(data: any[]): any[] {
    data.sort((a, b) => a.key.localeCompare(b.key)).reverse();
    return data;
  }

  getMeterDate() {
    return this.datePipe.transform(new Date(), 'yyyy-MM')!;
  }

  getYearAndMonth() {
    const currentDate = new Date();
    const formattedDate = `${this.datePipe.transform(currentDate, 'yyyy', 'hu')} ${this.getHungarianMonthName(currentDate.getMonth() + 1)}`;
    return formattedDate;
  }

  getHungarianMonthName(month: number): string {
    const monthNames = [
      'január', 'február', 'március', 'április', 'május', 'június',
      'július', 'augusztus', 'szeptember', 'október', 'november', 'december'
    ];
    return monthNames[month - 1];
  }

  sortUsersByName() {
    this.meterusers.sort((a, b) => {
      const nameA = a.personalData.name.toUpperCase();
      const nameB = b.personalData.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }


  filterUsers() {
    this.filteredUsers = this.meterusers.filter((user) =>
      user.personalData.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onPageSizeChange() {
    this.page = 1;
  }

  saveMeter(userId: string) {
    const user = this.filteredUsers.find(u => u.id === userId);
    const meterKey = this.getMeterDate();
    const meterData = {
      [meterKey]: {
        meterColdOne: user.meterData.meterColdOne !== undefined ? user.meterData.meterColdOne : 0,
        meterColdTwo: user.meterData.meterColdTwo !== undefined ? user.meterData.meterColdTwo : 0,
        meterHotOne: user.meterData.meterHotOne !== undefined ? user.meterData.meterHotOne : 0,
        meterHotTwo: user.meterData.meterHotTwo !== undefined ? user.meterData.meterHotTwo : 0,
        amountOfHeat: user.meterData.amountOfHeat !== undefined ? user.meterData.amountOfHeat : 0,
      }
    };
    this.meterService.saveMeter(userId, meterData);
  }
}
