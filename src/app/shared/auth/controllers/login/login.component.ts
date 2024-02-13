import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  getEmail = "";
  getPassword = "";

  constructor(private authService: AuthService) {
  }

  login() {
    console.log(this.getEmail)
    this.authService.login(this.getEmail, this.getPassword);
  }
}
