import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CondodatasService {

  constructor(private firestore: AngularFirestore) { }


  getCondoData(): Observable<any[]> {
    return this.firestore.collection('condoDatas').valueChanges({ idField: 'id' });
  }
}
