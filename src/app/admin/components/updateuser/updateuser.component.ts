import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { formFields } from '../../models/form-fields.data';



@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.css']
})
export class UpdateuserComponent {
  userId: string = "";
  @Input() user: any;
  addForm: any;
  formFields: any;

  constructor(
    public modalRefEdit: MdbModalRef<UpdateuserComponent>,
    private service: UsersService,
    private formBuilder: FormBuilder) {
    this.formFields = formFields;

  }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: [''],
      phone: [''],
      password: ['123456'],
      building: [''],
      floor: [''],
      door: [''],
      balance: [0],
      isAdmin: [0],
      squaremeter: []
    });

    if (this.user) {
      this.addForm.patchValue(this.user);
    }
  }

  onUpdate() {
    this.service.updateUser(this.addForm.value, this.user.id);
    this.modalRefEdit.close();
  }

  close() {
    this.modalRefEdit.close();
  }
}
