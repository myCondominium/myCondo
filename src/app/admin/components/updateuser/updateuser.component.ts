import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.css']
})
export class UpdateuserComponent {
  userId: string = "";
  user: any;
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
    private route: ActivatedRoute,
    private service: UsersService,
    private formBuilder: FormBuilder,
    private router: Router) {
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


    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.service.getUserById(this.userId).subscribe(userData => {
          this.addForm.patchValue(userData);
        });
      }
    });

  }

  onUpdate() {
    this.service.updateUser(this.addForm.value, this.userId);
    this.router.navigate(['admin/users']);
  }

}
