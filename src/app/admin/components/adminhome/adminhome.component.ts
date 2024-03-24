import { Component } from '@angular/core';
import { sharedService } from 'src/app/shared/services/shared.service';
@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent {
  condoName: any;

  constructor(private sharedService: sharedService) {
    this.condoName = this.getCondoName();
  }

  async getCondoName() {
    try {
      this.condoName = await this.sharedService.getCondoName();
    } catch (error) {
      console.error('Hiba a név lekérdezésekor:', error);
    }
  }
}
