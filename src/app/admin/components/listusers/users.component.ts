import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { UserdelconfirmComponent } from '../userdelconfirm/userdelconfirm.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { UpdateuserComponent } from '../updateuser/updateuser.component';
import { AdduserComponent } from '../adduser/adduser.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  error: any;
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  modalRefDelete: MdbModalRef<UserdelconfirmComponent> | null = null;
  modalRefEdit: MdbModalRef<UpdateuserComponent> | null = null;
  modalRefNew: MdbModalRef<AdduserComponent> | null = null;

  page: number = 1;
  pageSize: number = 10;

  documentIds: string[] = [];



  constructor(private service: UsersService, private modalService: MdbModalService) {
    this.error = this.getUsers();
  }

  // lakók adatainak lekérése
  getUsers() {
    this.service.getAllData().subscribe({
      next: (data: any[]) => {
        this.users = data;
        this.sortUsersByName();
        this.filterUsers();
      },
      error: (error) => {
        console.error('Hiba az adatok lekérésekor:', error);
      }
    });
  }

  // ha változtatjuk az egy oldalon megjelenő lakók számát akkor vissza az első lapra
  onPageSizeChange() {
    this.page = 1;
  }

  // név szerint sorbarendezzük
  sortUsersByName() {
    if (this.users.length > 1) {
      this.users.sort((a, b) => {
        const nameA = a.personalData.name.toUpperCase();
        const nameB = b.personalData.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
  }

  // a kereső mező alapján szűrjük
  filterUsers() {
    this.filteredUsers = this.users.filter((user) =>
      user.personalData.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // a törlés megerősítése
  openDeleteModal(username: any, userid: any) {
    this.modalRefDelete = this.modalService.open(UserdelconfirmComponent, {
      data: { title: username, userid: userid },
    });
    this.modalRefDelete.onClose.subscribe((userId: any) => {
      console.log(userId);
      if (userId != undefined) {
        this.service.deleteUser(userId);
      }

    });
  }

  // a szerkesztés modal megnyitása
  openEditModal(user: any) {
    console.log(user);
    this.modalRefEdit = this.modalService.open(UpdateuserComponent, {
      data: { user: user },
    });
  }

  // új lakó hozzáadása
  openNewModal() {
    this.modalRefNew = this.modalService.open(AdduserComponent, {
    })
  }
}
