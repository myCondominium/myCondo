import { Component } from '@angular/core';
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
export class AdduserComponent {
  addForm: any;
  formFields: any;
  mydata: any;

  constructor(
    public modalRefNew: MdbModalRef<AdduserComponent>,
    private formBuilder: FormBuilder,
    private service: UsersService,
    private emailService: EmailService

  ) {
    this.formFields = formFields;

    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: [''],
      phone: [''],
      building: [''],
      floor: [''],
      door: [''],
      password: ['123456'],
      balance: [0],
      isAdmin: [0],
      squaremeter: [],
      hasMeter: [1]
    });

  }
  onSave() {

    this.service.addUser(this.addForm.value)
      .then(() => {
        const emailData = {
          recipient: this.addForm.value.email,
          recipientName: this.addForm.value.name,
          subject: 'Regisztráció a társasházhoz',
          message: 'Önt sikeresen regisztráltuk a mycondo.hu weboldalon amit az ön társasházkezelője üzemeltet'
        };
        this.emailService.sendEmail(emailData);
      })
      .catch(error => {
        console.error('Hiba történt a felhasználó hozzáadása során:', error);
      })
      .finally(() => {
        this.close();
      });
  }


  close() {
    this.modalRefNew.close();
  }
}
