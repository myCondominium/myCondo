import { Component } from '@angular/core';
import { UploadfileService } from 'src/app/admin/services/uploadfile.service';
import { Homeservice } from '../../services/home.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent {
  uploadedFiles: any;
  lastLogin: any;
  userId = localStorage.getItem('userId') || '';


  constructor(private service: UploadfileService, private homeservice: Homeservice) {
    this.service.getUploadedFiles().subscribe(uFiles => {
      this.uploadedFiles = uFiles;
    });
  }

  async getLoginDates() {
    try {
      this.lastLogin = await this.homeservice.getLoginDates(this.userId);
    } catch (error) {
      console.error('Hiba a bejelentkezési adatok lekérésekor:', error);
    }
  }
}
