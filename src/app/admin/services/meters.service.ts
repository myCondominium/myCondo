import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, first, map, Observable, pluck } from 'rxjs';

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

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.getCombinedData().subscribe((data) => {
      this.meterusers = data;
    });
  }

  async myMeterVal(userId: string): Promise<any> {
    const metersCollection = this.firestore.collection('meters');
    const meterDoc = metersCollection.doc(userId);
    try {
      const docSnapshot = await meterDoc.get().toPromise();
      if (docSnapshot && docSnapshot.exists) {
        return docSnapshot.data();
      } else {
        console.log('A dokumentum nem található.');
        return null;
      }
    } catch (error) {
      console.error('Hiba a lekérés során:', error);
      return null;
    }
  }

  // ellenőrzés hogy létezik-e a meters tábla
  async checkMetersCollection() {
    try {
      const isMetersCollectionExists = await this.isMetersCollectionExists();
      if (isMetersCollectionExists) {
        console.log('A meters kollekció már létezik.');
      } else {
        console.log('A meters kollekció még nem létezik.');
        //nem létezik, így létrehozzuk a lakók azonosítójával
        this.getUsers().subscribe((data) => {
          this.users = data;
          this.users.forEach((user: any) => {
            this.createMeter(user.id);
          });
        });
      }
    } catch (error) {
      console.error('Hiba a meters kollekció ellenőrzése során:', error);
    }
  }

  async isMetersCollectionExists(): Promise<boolean> {
    try {
      const querySnapshot = await this.firestore.collection('meters').get().toPromise();
      return (querySnapshot?.size ?? 0) > 0;
    } catch (error) {
      console.error('Hiba a meters kollekció ellenőrzése során:', error);
      return false;
    }
  }

  getUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges({ idField: 'id' });
  }

  async getMeterNumber() {
    try {
      const data: any = await this.firestore
        .collection('meterSettings')
        .doc('metersAndCosts')
        .valueChanges({ idField: 'id' })
        .pipe(
          first(),
          pluck('meterData', 'meterNumber')
        )
        .toPromise();

      return data;
    } catch (error) {
      console.error('Hiba a meterNumber lekérdezése során:', error);
    }
  }

  // meter táblába a sorok létrehozása
  createMeter(userId: string) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Hónapok 0-tól kezdődnek, ezért +1
    const formattedDate = `${year}_${month}`;

    this.firestore.collection('meters').doc(userId).set({
      [formattedDate]: {
        meterColdOne: 0,
        meterColdTwo: 0,
        meterHotOne: 0,
        meterHotTwo: 0,
        amountOfHeat: 0
      }
    })
      .then(() => {
        console.log('A meters dokumentum sikeresen létrejött vagy frissült az', userId, 'azonosítóval.');
      })
      .catch((error) => {
        console.error('Hiba a meters dokumentum létrehozása vagy frissítése során:', error);
      });
  }

  // a két táblából lekért adatok
  getCombinedData(): Observable<CombinedData[]> {
    // Lekérjük a users és meters kollekciókat külön-külön
    const users$ = this.firestore.collection<User>('users').valueChanges({ idField: 'id' });
    const meters$ = this.firestore.collection<Meter>('meters').valueChanges({ idField: 'id' });

    // Egyesítjük a két observable-t az azonosító alapján
    return combineLatest([users$, meters$]).pipe(
      map(([users, meters]) => {
        // Egyesítjük az adatokat az azonosító alapján
        return users.map((user: User) => {
          const meterKey = `${new Date().getFullYear()}_${new Date().getMonth() + 1}`;

          // Új típusdefiníció, amely indexelhetővé teszi a meters objektumokat
          interface IndexableMeter extends Meter {
            [key: string]: any;
          }

          const meterData = (meters.find((m: IndexableMeter) => m.id === user.id) as IndexableMeter)?.[meterKey] || {};

          return { ...user, ...meterData };
        });
      })
    );
  }


  saveMeter(userId: string, meterData: any) {

    const metersCollection = this.firestore.collection('meters');
    const meterDoc = metersCollection.doc(userId);

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
