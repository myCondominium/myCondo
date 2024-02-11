import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { UserdelconfirmComponent } from '../userdelconfirm/userdelconfirm.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  modalRef: MdbModalRef<UserdelconfirmComponent> | null = null;

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

  openModal(username: any, userid: any) {
    this.modalRef = this.modalService.open(UserdelconfirmComponent, {
      data: { title: username, userid: userid },
    });
    this.modalRef.onClose.subscribe((userId: any) => {
      console.log(userId);
      if (userId != undefined) {
        this.service.deleteUser(userId);
      }

    });
  }

  onPageSizeChange() {
    this.page = 1;
  }

  toggleDetails(userId: number): void {
    this.expandedUserId = this.expandedUserId === userId ? null : userId;
  }

}
