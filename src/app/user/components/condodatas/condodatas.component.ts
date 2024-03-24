import { Component } from '@angular/core';
import { sharedService } from 'src/app/shared/services/shared.service';
@Component({
  selector: 'app-condodatas',
  templateUrl: './condodatas.component.html',
  styleUrls: ['./condodatas.component.css']
})
export class CondodatasComponent {
  condoDatas: any[] = [];

  constructor(
    private service: sharedService) {
    this.getCondoDatas();
  }

  // lekérjük a társasház adatait
  async getCondoDatas(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.service.getCondoDatas().subscribe(data => {
        this.condoDatas = data;
        console.log('condoDatas:', this.condoDatas);
        resolve();
      }, error => {
        reject(error);
      });
    });
  }


}
