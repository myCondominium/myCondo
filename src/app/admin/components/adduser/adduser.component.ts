import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { formFields } from '../../models/form-fields.data';
import { EmailService } from '../../services/email.service';


@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css', '../../../shared/css/admin-shared.css'],
})
export class AdduserComponent implements OnInit {
  addForm: any;
  formFields: any;
  mydata: any;
  nameError = false;
  emailError = false;

  constructor(
    public modalRefNew: MdbModalRef<AdduserComponent>,
    private formBuilder: FormBuilder,
    private service: UsersService,
    private emailService: EmailService

  ) {
    this.formFields = formFields;
  }
  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      building: [''],
      floor: [''],
      door: [''],
      password: [''],
      balance: [0],
      isAdmin: [0],
      squaremeter: [],
      hasMeter: [1]
    });
    const generatedPassword = this.service.generatePassword(8);
    this.addForm.patchValue({ password: generatedPassword });
  }

  onSave() {
    this.nameError = false;
    this.emailError = false;
    if (this.addForm.valid) {
      this.service.addUser(this.addForm.value)
        .then(() => {
          const emailData = {
            recipient: this.addForm.value.email,
            recipientName: this.addForm.value.name,
            subject: 'Regisztráció a társasházhoz',
            message: 'Önt sikeresen regisztráltuk a ' +
              '<a href="https://mycondo.hu" style="color: blue;" target="_blank">mycondo.hu</a> weboldalon amit az ön társasházkezelője üzemeltet.<br>' +
              'A belépéshez adja meg az email címét és a jelszavát.' +
              '<br>A jelszó: <b>' + this.addForm.value.password + '</b>' +
              '<br>Az adatainak védelme érdekében változtassa meg a jelszavát. '
          };
          this.emailService.sendEmail(emailData);
        })
        .catch(error => {
          console.error('Hiba történt a felhasználó hozzáadása során:', error);
        })
        .finally(() => {
          this.close();
        });
    } if (this.addForm.get('name').invalid) {
      this.nameError = true;
    } if (this.addForm.get('email').invalid) {
      this.emailError = true;
    }
  }



  close() {
    this.modalRefNew.close();
  }
}
