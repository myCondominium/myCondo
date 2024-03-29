import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserData } from '../auth/models/UserData';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(
        private auth: AngularFireAuth,
        private router: Router,
        private firestore: AngularFirestore
    ) { }

    async canActivate(): Promise<boolean> {
        try {
            const user = await this.waitForCurrentUser();

            if (!user) {
                this.redirectToLoginPage();
                return false;
            }

            const uid = user.uid;
            const userData = await this.getUserData(uid);

            if (!userData.exists) {
                console.error('A felhasználó adatai nem találhatók.');
                this.redirectToLoginPage();
                return false;
            }

            const userDataObject: UserData = userData.data() as UserData;

            if (userDataObject.isAdmin) {
                return true; // Az adminok elérhetik az oldalt
            } else {
                this.redirectToUserPage();
                return false;
            }
        } catch (error) {
            console.error('Hiba a canActivate metódusban: ', error);
            this.redirectToLoginPage();
            return false;
        }
    }

    private async waitForCurrentUser(): Promise<any> {
        return new Promise((resolve) => {
            this.auth.onAuthStateChanged((user) => {
                resolve(user);
            });
        });
    }

    private async getUserData(uid: string): Promise<any> {
        try {
            return await this.firestore.collection('users').doc(uid).collection('personaldatas').doc('datas').get().toPromise();
        } catch (error) {
            console.error('Hiba az adatok lekérdezésekor: ', error);
            throw error;
        }
    }

    private redirectToUserPage(): void {
        this.router.navigate(['/lako']); // Nem adminokat átirányítjuk az /user oldalra
    }

    private redirectToLoginPage(): void {
        this.router.navigate(['/login']);
    }
}
