import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface MeterData {
  meterData: {
    start: number;
    end: number;
    commonCost: number;
    waterHeating: number;
    heatingBase: number;
    heatingMulti: number;
    meterNumber: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  condoData: any;
  field: any;
  selectedMeterNumber: number = 2;
  metersStart: any;
  metersEnd: any;
  mCommonCost: any;
  mWaterHeating: any;
  mHeatingBase: any;
  mHeatingMulti: any;
  meterData: MeterData | undefined;

  constructor(private firestore: AngularFirestore) {

  }

  getMetersData(): Observable<MeterData | undefined> {
    const collectionName = 'meterSettings';
    const documentId = 'metersAndCosts';

    return this.firestore.collection(collectionName).doc(documentId).get().pipe(
      map((doc) => {
        if (doc.exists) {
          const data = doc.data() as MeterData;

          if (data && data.meterData) {
            return data;
          }
        }
        return undefined;
      })
    );
  }

  saveCost(data: any) {

    const collectionName = 'meterSettings';
    const documentId = 'metersAndCosts';

    const collectionRef = this.firestore.collection(collectionName);

    // Ellenőrizzük, hogy a kollekció létezik-e
    collectionRef.get().subscribe((snapshot) => {
      if (snapshot.size === 0) {
        // A kollekció nem létezik, létrehozzuk
        const documentRef = collectionRef.doc(documentId);
        documentRef.set(data)
          .then(() => {
            console.log('Adatok sikeresen mentve vagy frissítve!');
          })
          .catch((error) => {
            console.error('Hiba a mentés vagy frissítés során:', error);
          });
      } else {
        collectionRef.doc(documentId).set(data, { merge: true })
          .then(() => {
            console.log('Adatok sikeresen mentve vagy frissítve!');
          })
          .catch((error) => {
            console.error('Hiba a mentés vagy frissítés során:', error);
          });
        return
      }
    });
    return
  }

  saveMeterNumber(data: any) {
    const collectionName = 'meterSettings';
    const documentId = 'metersAndCosts';
    const collectionRef = this.firestore.collection(collectionName);

    // Ellenőrizzük, hogy a kollekció létezik-e
    collectionRef.get().subscribe((snapshot) => {
      if (snapshot.size === 0) {
        // A kollekció nem létezik, létrehozzuk
        const documentRef = collectionRef.doc(documentId);
        documentRef.set(data)
          .then(() => {
            console.log('Adatok sikeresen mentve vagy frissítve!');
          })
          .catch((error) => {
            console.error('Hiba a mentés vagy frissítés során:', error);
          });
      } else {
        collectionRef.doc(documentId).set(data, { merge: true })
          .then(() => {
            console.log('Adatok sikeresen mentve vagy frissítve!');
          })
          .catch((error) => {
            console.error('Hiba a mentés vagy frissítés során:', error);
          });
      }
      return
    });
    return
  }

  saveDate(data: any) {

    const collectionName = 'meterSettings';
    const documentId = 'metersAndCosts';
    const collectionRef = this.firestore.collection(collectionName);
    // Ellenőrizzük, hogy a kollekció létezik-e
    collectionRef.get().subscribe((snapshot) => {
      if (snapshot.size === 0) {
        // A kollekció nem létezik, létrehozzuk
        const documentRef = collectionRef.doc(documentId);
        documentRef.set(data)
          .then(() => {
            console.log('Adatok sikeresen mentve vagy frissítve!');
          })
          .catch((error) => {
            console.error('Hiba a mentés vagy frissítés során:', error);
          });
      } else {
        collectionRef.doc(documentId).set(data, { merge: true })
          .then(() => {
            console.log('Adatok sikeresen mentve vagy frissítve!');
          })
          .catch((error) => {
            console.error('Hiba a mentés vagy frissítés során:', error);
          });
      }
    });

  }

  deleteFirestoreDocument(dataId: string): Promise<void> {
    const collectionRef = this.firestore.collection('condoDatas');
    return new Promise<void>((resolve, reject) => {
      collectionRef.doc(dataId).delete()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


  updateFirestoreDocument(dataId: string, title: string, data: string, editable: boolean): Promise<void> {
    const collectionRef = this.firestore.collection('condoDatas');
    return collectionRef.doc(dataId).update({
      fields: [{ title, data, editable }]
    });
  }

  saveDataRow(userId: any, title: any, data: any, editable: any) {
    const timestamp = new Date();
    const formattedTimestamp = timestamp.toISOString();
    const uniqueId = timestamp.getTime().toString();
    const collectionRef = this.firestore.collection('condoDatas');

    if (userId) {
      // Ha van userId, akkor frissítjük az adott dokumentumot
      if ((title.trim() !== '' && data.trim() !== '') || (title.trim() !== '' && data.trim() === '')) {
        this.updateFirestoreDocument(userId, title, data, editable)
          .catch(error => {
            console.error('Hiba a document frissítése során:', error);
          });
      } else {
        //ha minkét mező üres vagy csak a cimke mező akkor töröljük a
        this.deleteFirestoreDocument(userId);
      }
    }
    if (!userId) {
      // Ha nincs userId, akkor hozz létre egy új dokumentumot
      if (title.trim() !== '' && data.trim() !== '') {
        collectionRef.doc(uniqueId).set({
          fields: [{ title, data, editable }],
          timestamp: formattedTimestamp,
        }).catch(error => {
          console.error('Hiba a document létrehozásakor:', error);
        });
      }
    }
    return
  }

  createCollectionWithField() {
    const condoNameField = { title: 'Társasház neve', data: '', editable: false };
    const condoEmailField = { title: 'Társasház email címe', data: '', editable: false };
    const timestamp = new Date();

    // Az első dokumentumhoz egyedi ID
    const uniqueIdForName = timestamp.getTime().toString();

    // Az első dokumentum timestamp
    const formattedTimestampToName = timestamp.toISOString();

    // Elmentjük az első dokumentumot a társasház nevével
    this.firestore.collection('condoDatas').doc(uniqueIdForName).set({
      fields: [condoNameField],
      timestamp: formattedTimestampToName,
    })
      .then(() => {
        this.condoData = [{ id: uniqueIdForName, fields: [condoNameField] }];
        return;
      })
      .catch((error) => {
        console.error('Hiba az első dokumentum létrehozása során:', error);
      });

    // A második dokumentumhoz egyedi ID
    const uniqueIdForEmail = timestamp.getTime().toString() + '_email';

    // A második dokumentum timestamp
    const formattedTimestampToEmail = timestamp.toISOString();

    // Elmentjük a második dokumentumot a társasház e-mail címével
    this.firestore.collection('condoDatas').doc(uniqueIdForEmail).set({
      fields: [condoEmailField],
      timestamp: formattedTimestampToEmail,
    })
      .then(() => {
        this.condoData.push({ id: uniqueIdForEmail, fields: [condoEmailField] });
        return;
      })
      .catch((error) => {
        console.error('Hiba a második dokumentum létrehozása során:', error);
      });
  }

  getCondoDatasAndAddField(): Observable<any> {
    return new Observable(observer => {
      this.firestore.collection('condoDatas').snapshotChanges().subscribe((data) => {
        if (data.length === 0) {
          // a kollekció nem létezik, létrehozzuk, azért hogy a Társasház neve: sor az első legyen.
          this.createCollectionWithField();

        } else {
          // létezik
          const condoData = data.map((d) => {
            const id = d.payload.doc.id;
            const payload = d.payload.doc.data() as any;
            const fields = payload.fields.map((field: any) => {
              return { ...field, editable: field.editable ?? true };
            });
            return { id, fields };
          }) as any[];

          observer.next(condoData);
          observer.complete();
        }
      });
    });
  }







}

