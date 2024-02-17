import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { UserdelconfirmComponent } from '../userdelconfirm/userdelconfirm.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { UpdateuserComponent } from '../updateuser/updateuser.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  modalDeleteRef: MdbModalRef<UserdelconfirmComponent> | null = null;
  modalRefEdit: MdbModalRef<UpdateuserComponent> | null = null;


  page: number = 1;
  pageSize: number = 10;

  expandedUserId: number | null = null;

  constructor(private service: UsersService, private modalService: MdbModalService) {
    this.getUsers();
  }

  getUsers() {
    this.service.getUsers().subscribe((data) => {
      this.users = data;
      this.sortUsersByName();
      this.filterUsers();
    })
  }

  sortUsersByName() {
    this.users.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openDeleteModal(username: any, userid: any) {
    this.modalDeleteRef = this.modalService.open(UserdelconfirmComponent, {
      data: { title: username, userid: userid },
    });
    this.modalDeleteRef.onClose.subscribe((userId: any) => {
      console.log(userId);
      if (userId != undefined) {
        this.service.deleteUser(userId);
      }

    });
  }

  openEditModal(user: any) {
    console.log(user);

    this.modalRefEdit = this.modalService.open(UpdateuserComponent, {
      data: { user: user },
    });
  }

  onPageSizeChange() {
    this.page = 1;
  }

  toggleDetails(userId: number): void {
    this.expandedUserId = this.expandedUserId === userId ? null : userId;
  }


}
