import { Injectable } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LoginFailedComponent } from '../auth/controllers/login-failed/login-failed.component';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthguardService } from './authguard.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LogoutcomfirmComponent } from '../auth/controllers/logoutcomfirm/logoutcomfirm.component';
import { PasswordresetService } from 'src/app/shared/services/passwordreset.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  modalRef: MdbModalRef<LoginFailedComponent> | null = null;
  user: any;
  userId: any;

  constructor(
    private modalService: MdbModalService,
    private router: Router,
    private auth: AngularFireAuth,
    private authGuard: AuthguardService,
    private firestore: AngularFirestore,
    private pwreset: PasswordresetService
  ) {
    this.authStateChange();
  }


  authStateChange() {
    this.auth.onAuthStateChanged(user => {
      if (user && user.email) {
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async login(email: string, password: string) {

    await this.auth.signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        this.userId = user?.uid;
        const userData = await this.getUserData(this.userId);
        this.redirectByRole(userData.isAdmin);
      })
      .catch((error) => {
        this.openLoginFailedModal();
        this.redirectToLoginPage();
      });
  }


  openLoginFailedModal() {
    this.modalRef = this.modalService.open(LoginFailedComponent);
  }

  async resetPassword(email: string) {
    try {
      await this.pwreset.resetPassword(email);
    } catch (error) {
      console.error('Hiba a jelszó resetnél:', error);
    }
  }

  async getUserData(uid: string): Promise<any> {
    try {
      const datas = await this.firestore.collection('users').doc(uid).collection('personaldatas').doc('datas').get().toPromise();
      return datas?.data() || {};
    } catch (error) {
      console.error("Hiba az adatok lekérésekor:", error);
    }
  }

  private redirectByRole(isAdmin: any) {
    isAdmin ? this.redirectToAdminPage() : this.redirectToUserPage();
  }

  private redirectToUserPage(): void {
    this.saveLoginDate(this.userId);
    this.router.navigate(['/lako/fooldal']);
  }

  private async saveLoginDate(userId: any) {
    const timestamp = new Date();

    try {
      const userRef = this.firestore.collection('users').doc(userId).collection('loginHistory').doc('datas');

      await userRef.update({
        [timestamp.getTime().toString()]: timestamp,
      });

      console.log('Bejelentkezési időpont sikeresen mentve.');
    } catch (error) {
      console.error('Hiba a bejelentkezés időpontjának mentésekor:', error);
    }
  }

  private redirectToLoginPage(): void {
    this.router.navigate(['/login']);
  }

  private redirectToAdminPage(): void {
    this.saveLoginDate(this.userId);
    this.router.navigate(['/admin/home']);
  }

  logout() {
    this.modalRef = this.modalService.open(LogoutcomfirmComponent);
    this.modalRef.onClose.subscribe((submit: any) => {
      if (submit) {
        this.authGuard.logout();
      }
    });
  }


}

