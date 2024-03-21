import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BBoardService {

  constructor(private firestore: AngularFirestore) { }

  getAllBulletinBoardData(): Observable<any[]> {
    return this.firestore.collection('bulletinboard', ref => ref.orderBy('timestamp', 'desc')).valueChanges({ idField: 'id' });
  }

  async saveToDatabase(selectedBulletin: any, editorContent: any) {
    if (!editorContent) {
      alert('A tartalom nem lehet üres.');
      return;
    }

    const data = {
      content: editorContent,
      timestamp: selectedBulletin ? selectedBulletin.timestamp : new Date(),
    };

    try {
      if (selectedBulletin) {
        await this.firestore.doc(`bulletinboard/${selectedBulletin.id}`).update(data);
        selectedBulletin = null;
      } else {
        await this.firestore.collection('bulletinboard').add(data);
      }

      editorContent = '';
      this.getAllBulletinBoardData();
    } catch (error) {
      console.error('Hiba történt a mentés során:', error);
    }
  }


  deleteBulletin(bulletinId: any) {
    this.firestore.doc(`bulletinboard/${bulletinId}`).delete();
  }
}

