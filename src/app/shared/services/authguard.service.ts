import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { UserData } from '../auth/models/UserData';

@Injectable()
export class AuthguardService implements CanActivate {

  constructor(private auth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { }

  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      // Sikeres kijelentkezés
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Kijelentkezési hiba:', error);
    }
  }

  async canActivate(): Promise<boolean> {
    try {
      const user = await this.auth.currentUser;

      if (user) {
        const uid = user.uid;
        const userData = await this.firestore.collection('users').doc(uid).collection('personaldatas').doc('datas').get().toPromise();
        return userData?.exists ?? false;
      } else {
        await this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      console.error('Hiba az authState figyelése során:', error);
      return false;
    }
  }
}
