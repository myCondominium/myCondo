import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class sharedService {
  userId: string | undefined;
  enableDictateChanged: any;

  constructor(private firestore: AngularFirestore) { }

  // a leadások dátuma
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

  // óraállások mentése
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

  // a beállítások értékét adja vissza 
  async getMetersData(doc: string): Promise<any> {
    const snapshot = await this.firestore.collection('metersettings').doc(doc).get().toPromise();
    return snapshot?.data();
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

  // a társasház adatainak lekérése
  getCondoDatas(): Observable<any[]> {
    return this.firestore.collection('condodatas').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as object;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }


  getUserData(userId: string) {
    return this.firestore.collection('users').doc(userId).collection('personaldatas').doc('datas').valueChanges();
  }
}
