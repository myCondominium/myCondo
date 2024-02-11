import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class BBoardService {

  constructor(private firestore: AngularFirestore) { }

  getAllBulletinBoardData(): Observable<any[]> {
    //return this.firestore.collection('bulletinboard').valueChanges({ idField: 'id' });
    return this.firestore.collection('bulletinboard', ref => ref.orderBy('timestamp', 'desc')).valueChanges({ idField: 'id' });

  }

  saveToDatabase(selectedBulletin: any, editorContent: any) {
    if (selectedBulletin) {
      // Módosítás esetén
      if (editorContent !== '') {
        this.firestore.doc(`bulletinboard/${selectedBulletin.id}`).update({
          content: editorContent,
          timestamp: new Date(),
        }).then(() => {
          selectedBulletin = null;
          editorContent = '';
          this.getAllBulletinBoardData();
        });
      } else {
        // Ne mentsen üres tartalmat
        alert('A tartalom nem lehet üres.');
      }
    } else {
      // Új hozzáadása esetén
      if (editorContent !== '') {
        this.firestore.collection('bulletinboard').add({
          content: editorContent,
          timestamp: new Date(),
        }).then(() => {
          editorContent = '';
          this.getAllBulletinBoardData();
        });
      } else {
        // Ne mentsen üres tartalmat
        alert('A tartalom nem lehet üres.');
      }
    }
  }

  deleteBulletin(bulletinId: any) {
    this.firestore.doc(`bulletinboard/${bulletinId}`).delete();
  }
}

