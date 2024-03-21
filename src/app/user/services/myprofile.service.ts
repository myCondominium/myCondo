import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class MyprofileService {
  userId: string | undefined;
  constructor(private firestore: AngularFirestore) { }



  getUserData(userId: string) {
    return this.firestore.collection('users').doc(userId).collection('personaldatas').doc('datas').valueChanges();
  }
}
