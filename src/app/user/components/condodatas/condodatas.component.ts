import { Component } from '@angular/core';
import { CondodatasService } from '../../services/condodatas.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-condodatas',
  templateUrl: './condodatas.component.html',
  styleUrls: ['./condodatas.component.css']
})
export class CondodatasComponent {
  tempDatas: any[] | undefined;
  condoDatas: Observable<any[]> | undefined;

  constructor(
    private service: CondodatasService) {
    this.getCondoData();
  }

  getCondoData(): void {
    this.service.getCondoData().subscribe(data => {
      this.tempDatas = data.map(item => item.fields);
      const arr: any[] = [];
      this.tempDatas.forEach((element: any) => {
        arr.push(element[0]);
      });
      this.condoDatas = of(arr);
    });
  }


}
