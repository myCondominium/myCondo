import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { sharedService } from 'src/app/shared/services/shared.service';


@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css', '../../../shared/css/user-shared.css']
})
export class MyprofileComponent {
  userId = localStorage.getItem('userId') || '';
  userData: any = {};
  datas: any = [];
  message = false;
  constructor(
    private profileservice: sharedService,
    private auth: AngularFireAuth
  ) {
    this.getUserData();
  }

  getUserData() {
    this.profileservice.getUserData(this.userId).subscribe({
      next: (data) => {
        this.userData = data;
        this.createArray(this.userData);
      },
      error: (error) => {
        console.error('Hiba történt a userData lekérdezésekor:', error);
      }
    });
  }

  async resetPassword() {
    try {
      await this.auth.sendPasswordResetEmail(this.userData.email);
      this.message = true;
    } catch (error) {
      console.error('Hiba az email küldésekor:', error);
    }
  }

  createArray(userData: any) {
    this.datas = [
      { title: "Név", value: userData.name },
      { title: "Email cím", value: userData.email },
      { title: "Telefonszám", value: userData.phone },
      { title: "Lakás", value: userData.building + ". épület / " + userData.floor + ". emelet / " + userData.door + " ajtó" },
      { title: "Egyenleg", value: userData.balance + " Ft" }
    ]
  }
}
