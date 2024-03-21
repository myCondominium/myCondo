import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class CostsService {

  constructor(private firestore: AngularFirestore) { }

  // a beállítások értékét adja vissza 
  async getMetersData(doc: string): Promise<any> {
    const snapshot = await this.firestore.collection('metersettings').doc(doc).get().toPromise();
    return snapshot?.data();
  }
}
