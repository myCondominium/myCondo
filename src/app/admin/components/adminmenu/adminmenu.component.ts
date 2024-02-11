import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-adminmenu',
  templateUrl: './adminmenu.component.html',
  styleUrls: ['./adminmenu.component.css']
})
export class AdminmenuComponent {
  userEmail = localStorage.getItem('userEmail');
  constructor(private auth: AuthService) { }


  logout() {
    this.auth.logout();
  }
}
