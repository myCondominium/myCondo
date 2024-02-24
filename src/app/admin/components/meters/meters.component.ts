import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetersService } from '../../services/meters.service';

interface User {
  id: string;
}

interface MeterData {
  amountOfHeat: number;
  meterHotOne: number;
  meterHotTwo: number;
  meterColdOne: number;
  meterColdTwo: number;
}


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
  data: any; //modal
  userName: any;
  expandedUserId: number | null = null;

  constructor(
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private meterService: MetersService) {
    this.initializeData();

  }

  initializeData() {
    this.meterService.checkMetersCollection();
    this.meterService.getCombinedData().subscribe((data) => {
      this.meterusers = data;
      this.error = data;
      this.sortUsersByName();
      this.filterUsers();
    });
    this.meterNumber = this.getMeterNum();
    this.yearAndMonth = this.getYearAndMonth();
  }

  async getMeterNum() {
    try {
      this.meterNumber = await this.meterService.getMeterNumber();
    } catch (error) {
      console.error('Hiba:', error);
    }
  }

  openModal(content: any, userId: string, userName: string) {
    this.meterService.myMeterVal(userId).then((result) => {
      this.data = Object.entries(result)
        .map(([yearAndMonth, values]) => ({ yearAndMonth, ...values as MeterData }))
        .sort((a, b) => {
          return b.yearAndMonth.localeCompare(a.yearAndMonth, undefined, { numeric: true });
        });

      this.userName = userName;
      this.meterNumber = this.meterNumber;
      this.modalService.open(content, { centered: true });
    });
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
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  filterUsers() {
    this.filteredUsers = this.meterusers.filter((user) =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onPageSizeChange() {
    this.page = 1;
  }

  toggleDetails(userId: number): void {
    this.expandedUserId = this.expandedUserId === userId ? null : userId;
  }

  saveMeter(userId: string) {
    // Itt kinyerjük a megfelelő felhasználót a filteredUsers tömbből
    const user = this.filteredUsers.find(u => u.id === userId);
    const meterKey = `${new Date().getFullYear()}_${new Date().getMonth() + 1}`;
    const meterData = {
      [meterKey]: {
        meterColdOne: user.meterColdOne !== undefined ? user.meterColdOne : 0,
        meterColdTwo: user.meterColdTwo !== undefined ? user.meterColdTwo : 0,
        meterHotOne: user.meterHotOne !== undefined ? user.meterHotOne : 0,
        meterHotTwo: user.meterHotTwo !== undefined ? user.meterHotTwo : 0,
        amountOfHeat: user.amountOfHeat !== undefined ? user.amountOfHeat : 0,
      }
    };
    this.meterService.saveMeter(userId, meterData);
  }
}
