import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';


@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent {
  addForm: any;

  formFields = [
    { label: 'Név', name: 'name', type: 'text' },
    { label: 'E-mail', name: 'email', type: 'text' },
    { label: 'Telefon', name: 'phone', type: 'text' },
    { label: 'Épület', name: 'building', type: 'text' },
    { label: 'Emelet', name: 'floor', type: 'text' },
    { label: 'Ajtó', name: 'door', type: 'text' },
    { label: 'Négyzetméter', name: 'squaremeter', type: 'text' },
    { label: 'Egyenleg', name: 'balance', type: 'number' },
    {
      label: 'Admin', name: 'isAdmin', type: 'select', options: [
        { label: 'Nem', value: '0' },
        { label: 'Igen', value: '1' }
      ]
    }

  ];


  constructor(
    public modalRefNew: MdbModalRef<AdduserComponent>,
    private formBuilder: FormBuilder,
    private service: UsersService,
    private router: Router
  ) {
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
