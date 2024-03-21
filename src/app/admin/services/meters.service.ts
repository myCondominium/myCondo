import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { MeterData } from '../models/meterdata';

interface User {
  id: string;
}

interface Meter {
  id: string;
}

interface CombinedData extends User, Meter { }

@Injectable({
  providedIn: 'root'
})
export class MetersService {
  users: any;
  allData: CombinedData[] = [];
  meterusers: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 10;
  meterNumber: any;
  yearAndMonth: any;
  userName: any;
  expandedUserId: number | null = null;
  data: { [year: string]: MeterData } = {};

  constructor(
    private firestore: AngularFirestore
  ) {
  }

  getMeterData(userId: string): Observable<any[]> {
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

  getAllData(meterDate: string): Observable<any[]> {
    return this.firestore.collection('users').snapshotChanges().pipe(
      switchMap(usersSnapshot => {
        const userObservables = usersSnapshot.map(userDoc => {
          const userId = userDoc.payload.doc.id;
          const personalData$ = this.firestore.collection(`users/${userId}/personaldatas`).doc('datas').valueChanges();
          const meterData$ = this.firestore.collection(`users/${userId}/meterdatas`).doc('datas').valueChanges().pipe(
            map((meterData: any) => {
              if (meterData && meterData[meterDate]) {
                return meterData[meterDate];
              } else {
                return { meterColdOne: 0, meterColdTwo: 0, meterHotOne: 0, meterHotTwo: 0, amountOfHeat: 0 };
              }
            })
          );

          return combineLatest([personalData$, meterData$]).pipe(
            map(([personalData, meterData]) => ({ id: userId, personalData, meterData }))
          );
        });
        return combineLatest(userObservables);
      })
    );
  }

  async getMeterNumber(): Promise<any> {
    const snapshot = await this.firestore.collection('metersettings').doc('meternumber').get().toPromise();
    return snapshot?.data();
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
