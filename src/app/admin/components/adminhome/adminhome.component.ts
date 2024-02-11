import { Component } from '@angular/core';
import { AdminhomeService } from '../../services/adminhome.service';
@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent {
  condoName: any;

  constructor(private homeService: AdminhomeService) {
    this.condoName = this.getCondoName();
  }

  async getCondoName() {
    try {
      this.condoName = await this.homeService.getCondoName();
    } catch (error) {
      console.error('Hiba a név lekérdezésekor:', error);
    }
  }
}
