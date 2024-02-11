import { Component, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
  selector: 'app-usermenu',
  templateUrl: './usermenu.component.html',
  styleUrls: ['./usermenu.component.css']
})
export class UsermenuComponent {
  userEmail = localStorage.getItem('userEmail');
  isMenuOpen = false;


  constructor(private auth: AuthService, private renderer: Renderer2) {

  }


  logout() {
    this.auth.logout();
  }

  toggleDropdown() {
    const dropdown = document.getElementsByClassName('dropdown')[0];

    dropdown.classList.toggle('down');
    this.renderer.selectRootElement('.arrow').classList.toggle('gone');

    if (dropdown.classList.contains('down')) {
      setTimeout(() => {
        this.renderer.setStyle(dropdown, 'overflow', 'visible');
      }, 500);
    } else {
      this.renderer.setStyle(dropdown, 'overflow', 'hidden');
    }
  }
}
