import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  condoData: any;

  constructor(private firestore: AngularFirestore) { }

  // beáálítási adatok lekérése ill. mentése
  async getSettingDatas(docName: string): Promise<any> {
    const snapshot = await this.firestore.collection('metersettings').doc(docName).get().toPromise();
    const data = snapshot?.data();
    if (data && typeof data === 'object' && 'value' in data) {
      return data.value;
    } else {
      console.log('Hiba a beállítási adatok lekérésekor!');
    }
  }

  async saveSettingData(docName: string, value: any): Promise<void> {
    try {
      await this.firestore.collection('metersettings').doc(docName).set({ value: value });
      console.log('Beállítási adatok mentve:', { docName, value });
    } catch (error) {
      console.error('Hiba a beállítási adatok mentésekor:', error);
    }
  }

  // a társasház adatainak metódusai

  // ellenőrizzük hogy létezik-e a társasház adatait tartalmazó kollekció
  async checkIsCollectionExists(collectionName: string) {
    try {
      const snapshot = await this.firestore.collection(collectionName).get().toPromise();
      return snapshot?.size === 0;
    } catch (error) {
      console.error('Hiba történt a kollekció ellenőrzése során:', error);
      return false;
    }
  }

  // létrehozzuk az alapadatokat ha még nem létezik (társasház neve, email címe - ezeket nem lehet törölni)
  async createCollection() {
    const timestamp = new Date();

    try {
      const idForName = timestamp.getTime().toString() + '_name';
      await this.firestore.collection('condodatas').doc(idForName).set({
        title: 'Társasház neve',
        data: '',
        editable: false,
        timestamp: timestamp
      });

      const idForEmail = timestamp.getTime().toString() + '_email';
      await this.firestore.collection('condodatas').doc(idForEmail).set({
        title: 'Társasház email címe',
        data: '',
        editable: false,
        timestamp: timestamp
      });
    } catch (error) {
      console.error('Hiba a dokumentumok létrehozása során:', error);
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

  // a sor felülírása
  async updateRow(id: any, title: any, data: any) {
    await this.firestore.collection('condodatas').doc(id).update({
      title: title,
      data: data
    });
  }

  // új sor mentése
  async saveNewRow(title: any, data: any) {
    const timestamp = new Date();
    const id = timestamp.getTime().toString() + '_otherdata';
    await this.firestore.collection('condodatas').doc(id).set({
      title: title,
      data: data,
      editable: true,
      timestamp: timestamp
    });

  }

  // sor törlése
  async deleteRow(id: any) {
    await this.firestore.collection('condodatas').doc(id).delete();
  }
}









