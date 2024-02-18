import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { formFields } from '../../models/form-fields.data';



@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent {
  addForm: any;
  formFields: any;

  constructor(
    public modalRefNew: MdbModalRef<AdduserComponent>,
    private formBuilder: FormBuilder,
    private service: UsersService,
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
      squaremeter: []
    });

  }

  onSave() {

    this.service.addUser(this.addForm.value);
    this.modalRefNew.close();
  }

  close() {
    this.modalRefNew.close();
  }
}
