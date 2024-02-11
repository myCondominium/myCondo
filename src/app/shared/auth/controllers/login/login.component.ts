import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgZone } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  checkLogin: any;
  getEmail: string = "";
  getPassword: string = "";
  user: any;
  userData: any;

  constructor(
    private auth: AngularFireAuth,
    private ngZone: NgZone,
    private authService: AuthService,
    private router: Router) {
    // Az authState változását figyeljük
    this.auth.onAuthStateChanged((user) => {
      this.ngZone.run(() => {
        if (user) {
          if (user.email) {
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userId', user.uid);
          }
          this.user = user;
        } else {
          this.user = undefined;
          // Felhasználó nincs bejelentkezve, irányítsuk át a bejelentkezési oldalra
          this.router.navigate(['/login']);
        }
      });
    });
  }

  login(email: string, password: string) {
    this.authService.login(email, password);
  }


}
