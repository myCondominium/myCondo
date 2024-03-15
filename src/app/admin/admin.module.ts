import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminhomeComponent } from './components/adminhome/adminhome.component';
import { AdminmenuComponent } from './components/adminmenu/adminmenu.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminGuard } from '../shared/guards/adminguard';
import { AuthService } from '../shared/services/auth.service';
import { AdminhomeService } from './services/adminhome.service';
import { AdminfooterComponent } from './components/adminfooter/adminfooter.component';
import { BboardComponent } from './components/bboard/bboard.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { DatePipe } from '@angular/common';
import { UsersComponent } from './components/listusers/users.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MetersComponent } from './components/meters/meters.component';
import { AdduserComponent } from './components/adduser/adduser.component';
import { UpdateuserComponent } from './components/updateuser/updateuser.component';
import { UserdelconfirmComponent } from './components/userdelconfirm/userdelconfirm.component';
import { UsersService } from './services/users.service';

@NgModule({
  declarations: [
    AdminhomeComponent,
    AdminmenuComponent,
    AdminfooterComponent,
    BboardComponent,
    UsersComponent,
    SettingsComponent,
    MetersComponent,
    AdduserComponent,
    UpdateuserComponent,
    UserdelconfirmComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularEditorModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  bootstrap: [UsersComponent],

  providers: [
    AdminGuard,
    AuthService,
    AdminhomeService,
    DatePipe,
    MdbModalService,
    UsersService
  ],
})
export class AdminModule { }
