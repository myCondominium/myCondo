import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { formFields } from '../../models/form-fields.data';
import { EmailService } from '../../services/email.service';




@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.css', '../../../shared/css/admin-shared.css']
})
export class UpdateuserComponent {
  userId: string = "";
  @Input() user: any;
  addForm: any;
  formFields: any;
  nameError = false;
  emailError = false;
  constructor(
    public modalRefEdit: MdbModalRef<UpdateuserComponent>,
    private service: UsersService,
    private formBuilder: FormBuilder,
    private emailService: EmailService) {
    this.formFields = formFields;
  }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: [''],
      building: [''],
      floor: [''],
      door: [''],
      balance: [0],
      isAdmin: [0],
      hasMeter: [1],
      squaremeter: []
    });

    if (this.user) {
      this.addForm.patchValue(this.user.personalData);
    }
  }

  onUpdate() {
    this.nameError = false;
    this.emailError = false;
    if (this.addForm.valid) {

      const generatedPassword = this.service.generatePassword(8);
      this.addForm.patchValue({ password: generatedPassword });

      this.service.updateUser(this.addForm.value, this.user.id)
        .then(() => {
          const emailData = {
            recipient: this.addForm.value.email,
            recipientName: this.addForm.value.name,
            subject: 'Email cím változás',
            message: 'Tisztelt lakónk!<br> ' +
              'a <a href="https://mycondo.hu" style="color: blue;" target="_blank">mycondo.hu</a> weboldalon rögzítették az email cím változását.<br>' +
              'Új jelszó került beállításra.' +
              '<br>Az új jelszó: <b>' + this.addForm.value.password + '</b>' +
              '<br>Az adatainak védelme érdekében változtassa meg a jelszavát. '
          };
          this.emailService.sendEmail(emailData);
        })
        .catch(error => {
          console.error('Hiba történt a felhasználó hozzáadása során:', error);
        })
        .finally(() => {
          this.modalRefEdit.close();
        });

    }
    if (this.addForm.get('name').invalid) {
      this.nameError = true;
    } if (this.addForm.get('email').invalid) {
      this.emailError = true;
    }

  }

  modalClose() {
    this.modalRefEdit.close();
  }
}
