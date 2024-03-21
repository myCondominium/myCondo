import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SavemetersService {

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

  saveMeter(userId: string, meterData: any) {
    const metersCollection = this.firestore.collection('users');
    const meterDoc = metersCollection.doc(userId).collection("meterdatas").doc('datas');

    meterDoc.set(meterData, { merge: true }) // merge: true segít hozzáadni az új mezőt a már létezőhöz
      .then(() => {
        console.log('Meter adatok sikeresen elmentve a meters kollekcióban!');
        return true;
      })
      .catch(error => {
        console.error('Hiba a meter adatok mentése során:', error);
        return false;
      });
  }
}
