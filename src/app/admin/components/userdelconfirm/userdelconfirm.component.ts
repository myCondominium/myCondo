import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-userdelconfirm',
  templateUrl: './userdelconfirm.component.html',
  styleUrls: ['./userdelconfirm.component.css']
})
export class UserdelconfirmComponent {
  title: string | null = null;
  userid?: any;

  constructor(public modalRef: MdbModalRef<UserdelconfirmComponent>) { }

  close(): void {
    this.modalRef.close();
  }

  closeAndDelete(): void {
    const closeMessage = this.userid;
    this.modalRef.close(closeMessage);
  }
}
