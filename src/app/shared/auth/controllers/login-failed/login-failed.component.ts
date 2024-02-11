import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';


@Component({
  selector: 'app-login-failed',
  templateUrl: './login-failed.component.html',
  styleUrls: ['./login-failed.component.css']
})
export class LoginFailedComponent {
  constructor(public modalRef: MdbModalRef<LoginFailedComponent>) { }

  close(): void {
    this.modalRef.close();
  }
}
