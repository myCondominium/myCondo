import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  email: string = '';
  password: string = '';
  userId: string | null = null;

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) { }

  async isUsernameExists(email: string): Promise<boolean> {
    try {
      // Ellenőrizze, hogy van-e már ilyen név a 'users' kollekcióban
      const querySnapshot = await this.firestore.collection('users')
        .ref.where('email', '==', email)
        .get();

      return !querySnapshot.empty; // Ha a lekérdezés talált eredményt, akkor az név már létezik
    } catch (error) {
      console.error('Hiba történt a felhasználónév ellenőrzése során:', error);
      return false;
    }
  }

  async addUser(userData: any) {
    const email = userData.email;

    const isUserExists = await this.isUsernameExists(email);

    if (isUserExists) {
      console.log('A felhasználó már létezik az adatbázisban.');
      alert("Ez az email cím már foglalt: " + email);
      return;
    }
    const password = userData.password || '123456';
    const isAdmin = parseInt(userData.isAdmin);

    const { name, phone, building, floor, door, squaremeter, balance } = userData;

    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const uid = user?.uid;

      const userDocRef = this.firestore.collection('users').doc(uid);
      await userDocRef.set({ name, email, phone, building, floor, door, squaremeter, balance, isAdmin });

      console.log('Felhasználó létrehozva Firestore-ban');
    } catch {

      console.log('Hiba a felhasználó létrehozása során!');
    }
  }

  getUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges({ idField: 'id' });
  }

  getUserById(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  async updateUser(userData: any, userId: string) {
    const email = userData.email;
    const password = userData.password || '123456';
    const isAdmin = parseInt(userData.isAdmin);
    const { phone, name, building, floor, door, squaremeter, balance } = userData;
    try {
      const userDocRef = this.firestore.collection('users').doc(userId);
      const uData = await userDocRef.get().toPromise();
      if (uData && uData.exists) {
        const userDataObject: { email: string } | undefined = uData.data() as { email: string } | undefined;
        if (userDataObject) {
          const oldEmail = userDataObject.email;

          if (oldEmail !== email) {
            console.log('Felhasználó email címe megváltozott. Régi cím: ' + oldEmail + ', új cím: ' + email);
            this.deleteUser(userId);
            this.addUser(userData);
          } else {
            await userDocRef.update({ name, email, phone, building, floor, door, squaremeter, balance, isAdmin });
            console.log('Adatok sikeresen frissítve');
          }
        } else {
          console.log('Nem találtam felhasználót ezen az azonosítón.');
        }
      } else {
        console.log('Nem találtam felhasználót ezen az azonosítón.');
      }
    } catch (error) {
      console.error('Hiba történt a frissítés során:', error);
    }
  }

  async deleteUser(userId: string) {
    try {
      await this.firestore.collection('users').doc(userId).delete();
      console.log('Felhasználó törölve');
    } catch (error) {
      console.error('Hiba történt a törlés során', error);
    }
  }

}
