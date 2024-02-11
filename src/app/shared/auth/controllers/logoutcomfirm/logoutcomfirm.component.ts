import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-logoutcomfirm',
  templateUrl: './logoutcomfirm.component.html',
  styleUrls: ['./logoutcomfirm.component.css']
})
export class LogoutcomfirmComponent {
  title: string | null = null;
  userEmail = localStorage.getItem('userEmail');

  constructor(public modalRef: MdbModalRef<LogoutcomfirmComponent>) { }

  close(): void {
    this.modalRef.close();
  }

  closeAndLogout(): void {
    this.modalRef.close(true);
  }
}
