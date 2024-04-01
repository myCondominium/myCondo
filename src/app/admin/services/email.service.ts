import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  url = 'https://mycondo.hu/php/sendmail.php';

  constructor(private http: HttpClient) { }
  sendEmail(emailData: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post(this.url, 'emailData=' + encodeURIComponent(JSON.stringify(emailData)), { headers }).subscribe(response => {
      console.log('Email küldése sikeres:', response);
    }, error => {
      console.error('Hiba történt az email küldése során:', error);
    });
  }

}



