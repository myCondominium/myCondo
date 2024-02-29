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

  async getCondoName() {
    try {
      const collectionRef = this.firestore.collection('condoDatas');
      const querySnapshot = await collectionRef.get().toPromise();

      if (querySnapshot && !querySnapshot.empty) {
        const firstDocument: any = querySnapshot.docs[0].data();

        if (firstDocument.fields && firstDocument.fields.length > 0) {
          return firstDocument.fields[0].data;
        } else {
          return "Még nincs beállítva a th. neve";
        }
      } else {
        return "Még nincs beállítva a th. neve";
      }
    } catch (error) {
      console.error('Hiba a lekérdezés során:', error);
      throw error;
    }
  }


}

