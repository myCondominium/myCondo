import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PasswordresetService {

  constructor(private auth: AngularFireAuth, private router: Router) { }

  async resetPassword(email: string) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Hiba az email küldésekor:', error);
    }
  }
}
