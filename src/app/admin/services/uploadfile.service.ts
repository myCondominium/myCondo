import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadfileService {
  selectedFile: File | null = null;
  uploadProgress: Observable<number> | null = null;
  downloadURL: Observable<string> | null = null;

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore) { }


  uploadFile(selectedFile: File, description: string): AngularFireUploadTask {
    const filePath = `uploads/${Date.now()}^${selectedFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, selectedFile);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        const downloadURL = fileRef.getDownloadURL();
        downloadURL.subscribe(url => {
          this.saveFileData(url, filePath, description);
        });
      })
    ).subscribe();

    return uploadTask;
  }

  saveFileData(downloadURL: string, filePath: string, description: string) {
    this.firestore.collection('files').add({ downloadURL, filePath, description })
      .then(() => {
        console.log('Fájl sikeresen hozzáadva a Firestore-ba');
      })
      .catch((error) => {
        console.error('Hiba történt a fájl hozzáadása közben:', error);
      });
  }

  getUploadedFiles(): Observable<any[]> {
    return this.firestore.collection('files').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          const { fileName, timestamp } = this.extractFileName(data.filePath); // Fájlnév kinyerése
          return { id, fileName, timestamp, ...data };
        }).sort((a, b) => {
          return +b.timestamp - +a.timestamp; // Időbélyegző alapján rendezés
        });
      })
    );
  }

  private extractFileName(filePath: string): { timestamp: any, fileName: any } {
    const parts = filePath.split('/');
    const fileNameWithTimestamp = parts[1];
    const fileName = fileNameWithTimestamp.split('^')[1];
    const timestamp = fileNameWithTimestamp.split('^')[0];
    return { fileName, timestamp };
  }

  deleteFile(fileId: string, filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Töröljük a fájlt a Firebase Storage-ból
      const fileRef = this.storage.ref(filePath);
      fileRef.delete().toPromise()
        .then(() => {
          // Ha a fájl sikeresen törölve lett a Storage-ból, töröljük az adatbázisból is
          this.firestore.collection('files').doc(fileId).delete()
            .then(() => {
              resolve(); // Törlés sikeres
            })
            .catch((error) => {
              reject(error); // Hiba a fájl törlésekor az adatbázisból
            });
        })
        .catch((error) => {
          reject(error); // Hiba a fájl törlésekor a Storage-ból
        });
    });
  }

}
