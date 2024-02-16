import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/controllers/login/login.component';
import { SharedRoutingModule } from './shared-routing.module';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { DatePipe } from '@angular/common';
import { LoginFailedComponent } from './auth/controllers/login-failed/login-failed.component';
import { AdminGuard } from './guards/adminguard';
import { UserGuard } from './guards/userguard';
import { LogoutcomfirmComponent } from './auth/controllers/logoutcomfirm/logoutcomfirm.component';
import { NotfoundComponent } from './auth/controllers/notfound/notfound.component';
import { PasswordresetComponent } from './auth/controllers/passwordreset/passwordreset.component';
import { ChangepasswordComponent } from './auth/controllers/changepassword/changepassword.component';

@NgModule({
  declarations: [
    LoginComponent,
    LoginFailedComponent,
    LogoutcomfirmComponent,
    NotfoundComponent,
    PasswordresetComponent,
    ChangepasswordComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgbModule,

  ],


  providers: [MdbModalService, DatePipe, AdminGuard, UserGuard],
})
export class SharedModule { }
