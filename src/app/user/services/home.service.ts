import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class Homeservice {
  meterData: any;
  userId: string | undefined;

  constructor(private firestore: AngularFirestore) {

  }

  // az user utolsó előtti bejelentkezésének lekérése
  async getLoginDates(userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const loginHistoryRef = this.firestore.collection(`users/${userId}/loginHistory`).doc('datas');
        const snapshot = await loginHistoryRef.get().toPromise();
        const loginData: any = snapshot?.data() || {};

        const sortedTimestamps = Object.keys(loginData).sort((a, b) => +b - +a);
        const secondToLastDate = sortedTimestamps[1] !== undefined ? sortedTimestamps[1] : 0;
        resolve(secondToLastDate);
      } catch (error) {
        console.error('Hiba a bejelentkezési adatok lekérésekor:', error);
        reject(error);
      }
    });
  }

}
