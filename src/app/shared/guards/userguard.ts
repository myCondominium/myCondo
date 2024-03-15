import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first } from 'rxjs/operators';
import { UserData } from '../auth/models/UserData';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private auth: AngularFireAuth,
        private router: Router,
        private firestore: AngularFirestore) { }

    canActivate(): Promise<boolean> {
        return new Promise(async (resolve) => {
            this.auth.authState.pipe(first()).subscribe(async (user) => {
                if (user) {
                    const uid = user.uid;
                    const userData = await this.getUserData(uid);
                    if (userData?.exists) {
                        const userDataObject: UserData = userData.data() as UserData;
                        if (!userDataObject.isAdmin) {
                            resolve(true); // A nemadminok elérhetik az oldalt
                        } else {
                            this.redirectToUserPage();
                            resolve(false);
                        }
                    }
                } else {
                    this.redirectToLoginPage();
                    resolve(false);
                }
            }, (error) => {
                resolve(false);
            });
        });
    }

    private async getUserData(uid: string): Promise<any> {
        return await this.firestore.collection('users').doc(uid).collection('personaldatas').doc('datas').get().toPromise();
    }

    private redirectToUserPage(): void {
        this.router.navigate(['/lako']);
    }

    private redirectToLoginPage(): void {
        this.router.navigate(['/login']);
    }
}
