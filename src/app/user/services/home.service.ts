import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class Homeservice {
  meterData: any;
  userId: string | undefined;

  constructor(private firestore: AngularFirestore) {

  }

  // a beállítások értékét adja vissza 
  async getMetersData(doc: string): Promise<any> {
    const snapshot = await this.firestore.collection('metersettings').doc(doc).get().toPromise();
    return snapshot?.data();
  }


  // a leadott diktálási időpontok lekérése

  getMeterDates(userId: string): Observable<any[]> {
    return this.firestore.collection('users').doc(userId).collection('meterdatas').doc('datas').get().pipe(
      map(userDataSnapshot => {
        const data = userDataSnapshot.data();
        const dataArray = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            dataArray.push({ key, value: data[key] });
          }
        }
        return dataArray;
      })
    );
  }


  // a társasház nevének lekérése
  async getCondoName() {
    try {
      const snapshot = await this.firestore.collection('condodatas').get().toPromise();
      if (!snapshot?.empty) {
        const doc = snapshot?.docs[1];
        const data = doc?.data();
        if (data && typeof data === 'object' && 'data' in data) {
          return data.data;
        } else {
          console.log('A dokumentum elem nem tartalmazza a szükséges adatot.');
          return null;
        }
      } else {
        console.log('A kollekcióban nincsenek dokumentumok.');
        return null;
      }
    } catch (error) {
      console.error('Hiba történt a beállítási adatok lekérésekor:', error);
      return null;
    }
  }

  // az user utolsó előtti bejelentkezésének lekérése
  async getLoginDates(userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const loginHistoryRef = this.firestore.collection(`users/${userId}/loginHistory`).doc('datas');
        const snapshot = await loginHistoryRef.get().toPromise();
        const loginData: any = snapshot?.data() || {};

        const sortedTimestamps = Object.keys(loginData).sort((a, b) => +b - +a);
        console.log('sorted:', sortedTimestamps)

        const secondToLastDate = sortedTimestamps[1];

        resolve(secondToLastDate);
      } catch (error) {
        console.error('Hiba a bejelentkezési adatok lekérésekor:', error);
        reject(error);
      }
    });
  }

}
