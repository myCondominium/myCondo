import { Injectable } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LoginFailedComponent } from '../auth/controllers/login-failed/login-failed.component';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthguardService } from './authguard.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { LogoutcomfirmComponent } from '../auth/controllers/logoutcomfirm/logoutcomfirm.component';
import { UserData } from '../auth/models/UserData';
import { PasswordresetService } from 'src/app/shared/services/passwordreset.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  modalRef: MdbModalRef<LoginFailedComponent> | null = null;
  user: any;

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

    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);

      if (userCredential.user) {
        const user = await this.auth.currentUser;
        if (user) {
          const uid = user.uid;
          const email = user.email;
          const userData = await this.getUserData(uid);
          if (userData?.exists) {
            const userDataObject: UserData = userData.data() as UserData;

            if (userDataObject.passwordChanged) {
              this.redirectByRole(userDataObject.isAdmin);
            } else {
              if (email) {
                await this.resetPassword(email);
                await this.firestore.collection('users').doc(uid).update({
                  passwordChanged: true
                });
              }
              this.router.navigate(["login/changepassword"]);
            }
          }
        } else {
          this.redirectToLoginPage();
        }
      }
    } catch (error) {
      console.log("Hibás bejelentkezési adatok!");
      this.openLoginFailedModal();
    }
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

  private async getUserData(uid: string): Promise<any> {
    return this.firestore.collection('users').doc(uid).get().pipe(first()).toPromise();
  }

  private redirectByRole(isAdmin: any) {
    isAdmin ? this.redirectToAdminPage() : this.redirectToUserPage();
  }

  private redirectToUserPage(): void {
    this.router.navigate(['/lako/fooldal']);
  }

  private redirectToLoginPage(): void {
    this.router.navigate(['/login']);
  }

  private redirectToAdminPage(): void {
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

