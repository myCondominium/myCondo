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

  getMetersData() {
    return this.firestore.collection('meterSettings').doc('metersAndCosts').valueChanges();
  }



  async getMeterDate(userId: string): Promise<any> {
    try {
      const document = await this.firestore.collection("meters").doc(userId).get().toPromise();
      const fieldNames = Object.keys(document?.data() || {});
      return fieldNames;
    } catch (error) {
      console.error('Error getting field names:', error);
      throw error;
    }
  }
}

