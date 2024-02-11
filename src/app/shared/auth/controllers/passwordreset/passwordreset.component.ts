import { Component } from '@angular/core';
import { PasswordresetService } from 'src/app/shared/services/passwordreset.service';


@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent {
  email?: any;

  constructor(private pwreset: PasswordresetService) { }

  async resetPassword(email: string) {
    try {
      await this.pwreset.resetPassword(email);
    } catch (error) {
      console.error('Hiba a jelszó resetnél:', error);
    }

  }

}
