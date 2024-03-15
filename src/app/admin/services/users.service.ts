import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';




@Injectable({
  providedIn: 'root'
})
export class UsersService {
  email: string = '';
  password: string = '';
  userId: string | null = null;
  yearAndMonth: string = '';


  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private date: DatePipe) { }

  isUsernameExists(email: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.getAllData().subscribe({
        next: (userData: any[]) => {
          const user = userData.find((user: { personalData: { email: any; }; }) => user.personalData.email === email);
          resolve(user !== undefined);
        },
        error: (error: any) => {
          console.error('Hiba történt a felhasználónév ellenőrzése során:', error);
          reject(false);
        }
      });
    });
  }



  async addUser(userData: any) {
    const email = userData.email;

    const isUserExists = await this.isUsernameExists(email);
    console.log(isUserExists)

    if (isUserExists) {
      console.log('A felhasználó már létezik az adatbázisban.');
      alert("Ez az email cím már foglalt: " + email);
      return;
    }
    const password = userData.password || '123456';
    const isAdmin = parseInt(userData.isAdmin);

    const { name, phone, building, floor, door, squaremeter, balance } = userData;

    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const uid = user?.uid;

      const currentDateAndTime = this.date.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

      const userDocRef = this.firestore.collection('users').doc(uid).collection('personaldatas').doc('datas');
      await userDocRef.set({ name, email, phone, building, floor, door, squaremeter, balance, isAdmin });

      const loginDocRef = this.firestore.collection('users').doc(uid).collection('loginHistory').doc('datas');
      await loginDocRef.set({});

      const dataDocRef = this.firestore.collection('users').doc(uid);
      await dataDocRef.set({ added: currentDateAndTime });

      const mapData = { meterColdOne: 0, meterColdTwo: 0, meterHotOne: 0, meterHotTwo: 0, amountOfHeat: 0 };
      const meterDocRef = this.firestore.collection('users').doc(uid).collection('meterdatas').doc('datas');

      await meterDocRef.set({ ['2000-01']: mapData });

      console.log('Felhasználó létrehozva Firestore-ban');
    } catch {

      console.log('Hiba a felhasználó létrehozása során!');
    }
  }

  getAllData(): Observable<any[]> {
    return this.firestore.collection('users').snapshotChanges().pipe(
      switchMap(usersSnapshot => {
        const userObservables = usersSnapshot.map(userDoc => {
          const userId = userDoc.payload.doc.id;
          const personalData$ = this.firestore.collection(`users/${userId}/personaldatas`).doc('datas').valueChanges();
          const meterData$ = this.firestore.collection(`users/${userId}/meterdatas`).doc('datas').valueChanges();
          return combineLatest([personalData$, meterData$]).pipe(
            map(([personalData, meterData]) => ({ id: userId, personalData, meterData }))
          );
        });
        return combineLatest(userObservables);
      })
    );
  }

  async updateUser(userData: any, userId: string) {
    const email = userData.email;
    const password = userData.password || '123456';
    const isAdmin = parseInt(userData.isAdmin);
    const { phone, name, building, floor, door, squaremeter, balance } = userData;
    try {
      const userDocRef = this.firestore.collection('users').doc(userId).collection('personaldatas').doc('datas');
      const uData = await userDocRef.get().toPromise();
      if (uData && uData.exists) {
        const userDataObject: { email: string } | undefined = uData.data() as { email: string } | undefined;
        if (userDataObject) {
          const oldEmail = userDataObject.email;

          if (oldEmail !== email) {
            console.log('Felhasználó email címe megváltozott. Régi cím: ' + oldEmail + ', új cím: ' + email);
            this.deleteUser(userId);
            this.addUser(userData);
          } else {
            await userDocRef.update({ name, email, phone, building, floor, door, squaremeter, balance, isAdmin });
            console.log('Adatok sikeresen frissítve');
          }
        } else {
          console.log('Nem találtam felhasználót ezen az azonosítón.');
        }
      } else {
        console.log('Nem találtam felhasználót ezen az azonosítón.');
      }
    } catch (error) {
      console.error('Hiba történt a frissítés során:', error);
    }
  }


  async deleteUser(userId: string) {
    try {
      const userDocRef = this.firestore.collection('users').doc(userId);

      await this.firestore.collection('users').doc(userId).delete();

      const collections = ['personaldatas', 'meterdatas', 'loginHistory'];

      for (const collectionName of collections) {
        const collectionRef = userDocRef.collection(collectionName);
        const querySnapshot = await collectionRef.get().toPromise();
        await this.deleteCollection(querySnapshot);
      }


    } catch (error) {
      console.error('Hiba történt a personaldatas alkollekció törlésekor:', error);
    }
  }

  async deleteCollection(querySnapshot: any) {
    querySnapshot.forEach((doc: any) => {
      doc.ref.delete();
    });
  }

}
