import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CondodatasService {

  constructor(private firestore: AngularFirestore) { }


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
}
