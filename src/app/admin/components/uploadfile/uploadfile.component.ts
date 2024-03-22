import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadfileService } from '../../services/uploadfile.service';

@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.css']
})
export class UploadfileComponent {
  selectedFile: File | null = null;
  description: string = '';
  uploadedFiles: any;
  downloadURL: Observable<string> | null = null;

  constructor(private service: UploadfileService) {
    this.service.getUploadedFiles().subscribe(uFiles => {
      this.uploadedFiles = uFiles;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadFile() {
    if (!this.selectedFile) {
      return;
    }

    if (this.selectedFile) {
      if (this.service.uploadFile(this.selectedFile, this.description)) {
        this.cancel();
      };
    }
  }

  cancel() {
    this.selectedFile = null;
    this.description = '';
    const fileInput = document.querySelector('#file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }


  deleteFile(fileId: string, filePath: string) {
    if (confirm('Biztosan törölni szeretnéd ezt a fájlt?')) {
      this.service.deleteFile(fileId, filePath)
        .then(() => {
          console.log('Fájl sikeresen törölve');
        })
        .catch((error) => {
          console.error('Hiba történt a fájl törlése során:', error);
        });
    } else {
      console.log('A fájl törlése megszakítva');
    }
  }
}
