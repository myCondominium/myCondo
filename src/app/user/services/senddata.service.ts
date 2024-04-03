import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SenddataService {

  constructor() { }

  private dataSource = new Subject<any>();
  data$ = this.dataSource.asObservable();
  sendEnableDictateData(data: any) {
    this.dataSource.next(data);
  }

}
