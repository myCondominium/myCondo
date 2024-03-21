import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminhomeService {

  constructor(private firestore: AngularFirestore) { }

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
}

